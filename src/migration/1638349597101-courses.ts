import { MigrationInterface, QueryRunner } from 'typeorm';

export class courses1638349597101 implements MigrationInterface {
  name = 'courses1638349597101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "semester" character varying NOT NULL, "year" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" uuid, CONSTRAINT "REL_2a26294560102d94bc4c67ecfe" UNIQUE ("departmentId"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5"`,
    );
    await queryRunner.query(`DROP TABLE "courses"`);
  }
}
