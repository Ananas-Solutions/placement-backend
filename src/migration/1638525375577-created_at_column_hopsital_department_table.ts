import {MigrationInterface, QueryRunner} from "typeorm";

export class createdAtColumnHopsitalDepartmentTable1638525375577 implements MigrationInterface {
    name = 'createdAtColumnHopsitalDepartmentTable1638525375577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "department" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "hospital" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "hospital" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "hospital" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "createAt"`);
    }

}
