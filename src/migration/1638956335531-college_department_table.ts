import {MigrationInterface, QueryRunner} from "typeorm";

export class collegeDepartmentTable1638956335531 implements MigrationInterface {
    name = 'collegeDepartmentTable1638956335531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "college_departent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_fdf2a8082690333f7c2fdfcad9a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "college_departent"`);
    }

}
