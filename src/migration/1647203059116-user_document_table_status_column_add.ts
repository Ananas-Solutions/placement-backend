import {MigrationInterface, QueryRunner} from "typeorm";

export class userDocumentTableStatusColumnAdd1647203059116 implements MigrationInterface {
    name = 'userDocumentTableStatusColumnAdd1647203059116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_documents_status_enum" AS ENUM('PENDING', 'VERIFIED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD "status" "public"."user_documents_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_documents_status_enum"`);
    }

}
