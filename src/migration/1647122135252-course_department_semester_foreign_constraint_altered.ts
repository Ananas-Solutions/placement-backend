import {MigrationInterface, QueryRunner} from "typeorm";

export class courseDepartmentSemesterForeignConstraintAltered1647122135252 implements MigrationInterface {
    name = 'courseDepartmentSemesterForeignConstraintAltered1647122135252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_04b79a1d2c983390eb7b7a49ee9" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_04b79a1d2c983390eb7b7a49ee9"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5"`);
    }

}
