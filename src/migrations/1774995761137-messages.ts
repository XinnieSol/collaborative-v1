import { MigrationInterface, QueryRunner } from 'typeorm';

export class Messages1774995761137 implements MigrationInterface {
    name = 'Messages1774995761137';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "chat_room_id" uuid NOT NULL, "sender_id" uuid, "reply_to_id" uuid, "content" character varying NOT NULL, "sender_type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "deleted_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_5bb8108b85199f4ae096599917f" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_54e66104dd534ed1c191e44096f" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_54e66104dd534ed1c191e44096f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
        );
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_5bb8108b85199f4ae096599917f"`,
        );
        await queryRunner.query(`DROP TABLE "messages"`);
    }
}
