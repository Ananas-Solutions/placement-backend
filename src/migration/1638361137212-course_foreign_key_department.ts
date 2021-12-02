import {MigrationInterface, QueryRunner} from "typeorm";

export class courseForeignKeyDepartment1638361137212 implements MigrationInterface {
    name = 'courseForeignKeyDepartment1638361137212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "REL_2a26294560102d94bc4c67ecfe"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "REL_2a26294560102d94bc4c67ecfe" UNIQUE ("departmentId")`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
