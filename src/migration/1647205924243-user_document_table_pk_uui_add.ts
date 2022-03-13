import {MigrationInterface, QueryRunner} from "typeorm";

export class userDocumentTablePkUuiAdd1647205924243 implements MigrationInterface {
    name = 'userDocumentTablePkUuiAdd1647205924243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" DROP CONSTRAINT "PK_cea43819156528b63504c4afd4b"`);
        await queryRunner.query(`ALTER TABLE "user_documents" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD CONSTRAINT "PK_cea43819156528b63504c4afd4b" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" DROP CONSTRAINT "PK_cea43819156528b63504c4afd4b"`);
        await queryRunner.query(`ALTER TABLE "user_documents" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD CONSTRAINT "PK_cea43819156528b63504c4afd4b" PRIMARY KEY ("id")`);
    }

}
