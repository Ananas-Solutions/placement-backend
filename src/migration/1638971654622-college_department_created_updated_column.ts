import {MigrationInterface, QueryRunner} from "typeorm";

export class collegeDepartmentCreatedUpdatedColumn1638971654622 implements MigrationInterface {
    name = 'collegeDepartmentCreatedUpdatedColumn1638971654622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "college_departent" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "college_departent" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "college_departent" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "college_departent" DROP COLUMN "createAt"`);
    }

}
