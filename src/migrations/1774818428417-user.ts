import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1774818428417 implements MigrationInterface {
    name = 'User1774818428417';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "user_name" character varying, "auth_channel" character varying NOT NULL, "account_status" character varying NOT NULL DEFAULT 'pending', "last_seen" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_2360e0aef27a0621db2879fcd6" ON "users" ("email", "first_name", "last_name", "user_name", "account_status") `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_2360e0aef27a0621db2879fcd6"`,
        );
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
