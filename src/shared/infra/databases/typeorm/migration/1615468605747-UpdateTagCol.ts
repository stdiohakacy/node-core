import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTagCol1615468605747 implements MigrationInterface {
    name = 'UpdateTagCol1615468605747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "product_id" uuid NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "channel"."last_message_created_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "channel"."last_message_created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "product_id"`);
    }

}
