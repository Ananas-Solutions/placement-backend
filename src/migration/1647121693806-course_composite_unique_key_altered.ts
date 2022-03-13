import {MigrationInterface, QueryRunner} from "typeorm";

export class courseCompositeUniqueKeyAltered1647121693806 implements MigrationInterface {
    name = 'courseCompositeUniqueKeyAltered1647121693806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "unique_course" UNIQUE ("name", "departmentId", "semesterId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "unique_course"`);
    }

}
