import {MigrationInterface, QueryRunner} from "typeorm";

export class ChatModule1614442963130 implements MigrationInterface {
    name = 'ChatModule1614442963130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel_user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel_id" uuid NOT NULL, "user_id" uuid NOT NULL, "is_mute" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7e5d4007402f6c41e35003494f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "is_direct" boolean NOT NULL DEFAULT false, "is_private" boolean NOT NULL DEFAULT true, "last_seen" text NOT NULL DEFAULT '{}', "last_message_id" uuid, "last_message_created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel_id" uuid NOT NULL, "user_id" uuid NOT NULL, "parent_message_id" uuid, "content" character varying, "status" "message_status_enum" NOT NULL DEFAULT 'SENT', "is_pin" boolean NOT NULL DEFAULT false, "is_star" boolean NOT NULL DEFAULT false, "user_Id" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel_user" ADD CONSTRAINT "FK_d31b165b69b0b23135ce413ce09" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5e3e2aca0e37c40c428f37bfe2e" FOREIGN KEY ("user_Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5e3e2aca0e37c40c428f37bfe2e"`);
        await queryRunner.query(`ALTER TABLE "channel_user" DROP CONSTRAINT "FK_d31b165b69b0b23135ce413ce09"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "channel_user"`);
    }

}
