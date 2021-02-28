import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColTypeChat1614504682044 implements MigrationInterface {
    name = 'AddColTypeChat1614504682044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "type" "message_type_enum" NOT NULL DEFAULT 'CHAT'`);
        await queryRunner.query(`COMMENT ON COLUMN "channel"."last_message_created_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "channel"."last_message_created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "type"`);
    }

}
