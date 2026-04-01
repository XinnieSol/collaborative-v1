import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshToken1774879152191 implements MigrationInterface {
    name = 'RefreshToken1774879152191';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "token" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_3ddc983c5f7bcf132fd8732c3f4" UNIQUE ("user_id"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }
}
