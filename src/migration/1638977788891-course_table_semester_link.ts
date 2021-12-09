import {MigrationInterface, QueryRunner} from "typeorm";

export class courseTableSemesterLink1638977788891 implements MigrationInterface {
    name = 'courseTableSemesterLink1638977788891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "semester"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "semesterId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "semesterId"`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "year" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "semester" character varying NOT NULL`);
    }

}
