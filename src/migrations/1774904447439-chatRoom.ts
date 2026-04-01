import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatRoom1774904447439 implements MigrationInterface {
    name = 'ChatRoom1774904447439';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "chat_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "creator_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_c69082bd83bffeb71b0f455bd59" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_aceb16d84ebc8efbf79c9acaba" ON "chat_rooms" ("creator_id", "name") `,
        );
        await queryRunner.query(
            `CREATE TABLE "chat_room_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "chat_room_id" uuid NOT NULL, "user_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_736e2c819bfb5e5ab96ce8b43c6" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_56628fb4cec79f2a02f34caf33" ON "chat_room_members" ("chat_room_id", "user_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_rooms" ADD CONSTRAINT "FK_96bae026a633abbad40f7cf8c4f" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_room_members" ADD CONSTRAINT "FK_cab77d6448846706ad9b0ba41c9" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_room_members" ADD CONSTRAINT "FK_f7d4d1d255b71027906de8357f5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "chat_room_members" DROP CONSTRAINT "FK_f7d4d1d255b71027906de8357f5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_room_members" DROP CONSTRAINT "FK_cab77d6448846706ad9b0ba41c9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chat_rooms" DROP CONSTRAINT "FK_96bae026a633abbad40f7cf8c4f"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_56628fb4cec79f2a02f34caf33"`,
        );
        await queryRunner.query(`DROP TABLE "chat_room_members"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_aceb16d84ebc8efbf79c9acaba"`,
        );
        await queryRunner.query(`DROP TABLE "chat_rooms"`);
    }
}
