import { MigrationInterface, QueryRunner } from 'typeorm';

export class userHospitaDepartmentSupervisorTable1638032388377
  implements MigrationInterface
{
  name = 'userHospitaDepartmentSupervisorTable1638032388377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "hospital" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address1" character varying NOT NULL, "address2" character varying, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "hospitalId" uuid, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'CLINICAL COORDINATOR', 'CLINICAL SUPERVISOR', 'STUDENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'ADMIN', "locked" boolean NOT NULL DEFAULT false, "archived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "supervisor_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePicture" character varying, "qualification" character varying NOT NULL, "nationality" character varying NOT NULL, "speciality" character varying NOT NULL, "noOfYears" integer NOT NULL, "mobile" character varying NOT NULL, "email" character varying NOT NULL, "hospitalId" uuid, "departmentId" uuid, "userId" uuid, CONSTRAINT "REL_85375b5d387e2414ee1956fbd1" UNIQUE ("hospitalId"), CONSTRAINT "REL_d4a26a97f62cf4c29fdf05f09c" UNIQUE ("departmentId"), CONSTRAINT "REL_38e4b26a6970395f3daf0bc327" UNIQUE ("userId"), CONSTRAINT "PK_c256357334df55d9e8c94ee0e05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_1693b3f4b707af5acfb078771f9" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_85375b5d387e2414ee1956fbd1f" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_d4a26a97f62cf4c29fdf05f09cf" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_38e4b26a6970395f3daf0bc327c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_38e4b26a6970395f3daf0bc327c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_d4a26a97f62cf4c29fdf05f09cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_85375b5d387e2414ee1956fbd1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" DROP CONSTRAINT "FK_1693b3f4b707af5acfb078771f9"`,
    );
    await queryRunner.query(`DROP TABLE "supervisor_profile"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(`DROP TABLE "hospital"`);
  }
}
