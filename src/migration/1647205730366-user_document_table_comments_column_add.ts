import {MigrationInterface, QueryRunner} from "typeorm";

export class userDocumentTableCommentsColumnAdd1647205730366 implements MigrationInterface {
    name = 'userDocumentTableCommentsColumnAdd1647205730366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" ADD "comments" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" DROP COLUMN "comments"`);
    }

}
