import {MigrationInterface, QueryRunner} from "typeorm";

export class ChatModule1614423226099 implements MigrationInterface {
    name = 'ChatModule1614423226099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(20) NOT NULL DEFAULT '', "notice" character varying(100) NOT NULL DEFAULT '', "to_group_id" character varying(100) NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_message" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_user_id" uuid NOT NULL, "to_group_id" character varying(100) NOT NULL DEFAULT '', "message" text NOT NULL DEFAULT '', "attachments" text DEFAULT '[]', CONSTRAINT "PK_352d8ac0a05f84418d49b6fbffd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "to_group_id" character varying(100) NOT NULL DEFAULT '', CONSTRAINT "PK_c637f43a6f0d7891fec59f4d7a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "private_message" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_user_id" uuid NOT NULL, "to_user_id" uuid NOT NULL, "message" text NOT NULL DEFAULT '', "attachments" text DEFAULT '[]', CONSTRAINT "PK_dfe66cf2f224c9dc8be6ca5fde7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "from_user_to_user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_user_id" uuid NOT NULL, "to_user_id" uuid NOT NULL, "remark" character varying(10) DEFAULT '', "shield" character(1) DEFAULT '', CONSTRAINT "PK_fbbff2910b97c6b7251e73d6fc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_c637f43a6f0d7891fec59f4d7a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_message" ADD CONSTRAINT "FK_13e4de1f1a636c5b8e24a5a5162" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_user" ADD CONSTRAINT "FK_0837be536f0f518052a7bef2e04" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "private_message" ADD CONSTRAINT "FK_aaa3a51d4df536450aedd131d56" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "private_message" ADD CONSTRAINT "FK_5d95b0c9ecb3833838683f5ae36" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "from_user_to_user" ADD CONSTRAINT "FK_777e746adf08437c598aec1a0da" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "from_user_to_user" ADD CONSTRAINT "FK_ff489f1c3fa3cbef0924ab2fcec" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "from_user_to_user" DROP CONSTRAINT "FK_ff489f1c3fa3cbef0924ab2fcec"`);
        await queryRunner.query(`ALTER TABLE "from_user_to_user" DROP CONSTRAINT "FK_777e746adf08437c598aec1a0da"`);
        await queryRunner.query(`ALTER TABLE "private_message" DROP CONSTRAINT "FK_5d95b0c9ecb3833838683f5ae36"`);
        await queryRunner.query(`ALTER TABLE "private_message" DROP CONSTRAINT "FK_aaa3a51d4df536450aedd131d56"`);
        await queryRunner.query(`ALTER TABLE "group_user" DROP CONSTRAINT "FK_0837be536f0f518052a7bef2e04"`);
        await queryRunner.query(`ALTER TABLE "group_message" DROP CONSTRAINT "FK_13e4de1f1a636c5b8e24a5a5162"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_c637f43a6f0d7891fec59f4d7a7"`);
        await queryRunner.query(`DROP TABLE "from_user_to_user"`);
        await queryRunner.query(`DROP TABLE "private_message"`);
        await queryRunner.query(`DROP TABLE "group_user"`);
        await queryRunner.query(`DROP TABLE "group_message"`);
        await queryRunner.query(`DROP TABLE "group"`);
    }

}
