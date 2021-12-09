import {MigrationInterface, QueryRunner} from "typeorm";

export class collegeDepartmentLinkCoordinatorCourse1638965686315 implements MigrationInterface {
    name = 'collegeDepartmentLinkCoordinatorCourse1638965686315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD "departmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD CONSTRAINT "FK_1de2f25c464a72ca05ac42d6aef" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP CONSTRAINT "FK_1de2f25c464a72ca05ac42d6aef"`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP COLUMN "departmentId"`);
    }

}
