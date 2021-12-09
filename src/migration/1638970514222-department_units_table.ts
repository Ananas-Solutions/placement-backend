import {MigrationInterface, QueryRunner} from "typeorm";

export class departmentUnitsTable1638970514222 implements MigrationInterface {
    name = 'departmentUnitsTable1638970514222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" uuid, CONSTRAINT "PK_e777e8b0483fa6fa3a5766f722a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department_units" ADD CONSTRAINT "FK_bb0322472ee15f830e3ffb7729a" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "department_units" DROP CONSTRAINT "FK_bb0322472ee15f830e3ffb7729a"`);
        await queryRunner.query(`DROP TABLE "department_units"`);
    }

}
