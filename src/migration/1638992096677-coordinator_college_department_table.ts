import {MigrationInterface, QueryRunner} from "typeorm";

export class coordinatorCollegeDepartmentTable1638992096677 implements MigrationInterface {
    name = 'coordinatorCollegeDepartmentTable1638992096677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP CONSTRAINT "FK_1de2f25c464a72ca05ac42d6aef"`);
        await queryRunner.query(`CREATE TABLE "coordinator_college_department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "departmentId" uuid, CONSTRAINT "PK_3627e91641b7793cbe53835ac9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" ADD CONSTRAINT "FK_b20164f92cf18450381711c5040" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" ADD CONSTRAINT "FK_9198de661ce93690d97e0934962" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" DROP CONSTRAINT "FK_9198de661ce93690d97e0934962"`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" DROP CONSTRAINT "FK_b20164f92cf18450381711c5040"`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD "departmentId" uuid`);
        await queryRunner.query(`DROP TABLE "coordinator_college_department"`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD CONSTRAINT "FK_1de2f25c464a72ca05ac42d6aef" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
