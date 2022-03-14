import {MigrationInterface, QueryRunner} from "typeorm";

export class zerothMigrationInitialize1647237030482 implements MigrationInterface {
    name = 'zerothMigrationInitialize1647237030482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hospitalId" uuid, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hospital" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address1" character varying NOT NULL, "address2" character varying, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorityId" uuid, CONSTRAINT "PK_10f19e0bf17ded693ea0da07d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "authority" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "initials" character varying NOT NULL, "name" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_documents_status_enum" AS ENUM('PENDING', 'VERIFIED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "user_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "status" "public"."user_documents_status_enum" NOT NULL DEFAULT 'PENDING', "comments" character varying, "userId" uuid, CONSTRAINT "PK_cea43819156528b63504c4afd4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'CLINICAL COORDINATOR', 'CLINICAL SUPERVISOR', 'STUDENT')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'ADMIN', "locked" boolean NOT NULL DEFAULT false, "archived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "supervisor_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profilePicture" character varying, "qualification" character varying NOT NULL, "nationality" character varying NOT NULL, "speciality" character varying NOT NULL, "noOfYears" integer NOT NULL, "mobile" character varying NOT NULL, "email" character varying NOT NULL, "hospitalId" uuid, "departmentId" uuid, "userId" uuid, CONSTRAINT "REL_85375b5d387e2414ee1956fbd1" UNIQUE ("hospitalId"), CONSTRAINT "REL_d4a26a97f62cf4c29fdf05f09c" UNIQUE ("departmentId"), CONSTRAINT "REL_38e4b26a6970395f3daf0bc327" UNIQUE ("userId"), CONSTRAINT "PK_c256357334df55d9e8c94ee0e05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "college_departent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fdf2a8082690333f7c2fdfcad9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_college_department" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "departmentId" uuid, CONSTRAINT "PK_3627e91641b7793cbe53835ac9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."semester_semester_enum" AS ENUM('FALL', 'SPRING', 'SUMMER')`);
        await queryRunner.query(`CREATE TABLE "semester" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "semester" "public"."semester_semester_enum" NOT NULL, "year" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9129c1fd35aa4aded7a9825b38d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" uuid, "semesterId" uuid, CONSTRAINT "unique_course" UNIQUE ("name", "departmentId", "semesterId"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "coordinatorId" uuid, "courseId" uuid, CONSTRAINT "PK_e18ed80af535d6224d82c24482f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mobile" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_aa3c30ea969f1979a9b419f715" UNIQUE ("userId"), CONSTRAINT "PK_a1a131d873b24285b6e9234878c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" uuid, CONSTRAINT "PK_e777e8b0483fa6fa3a5766f722a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "training_site" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "speciality" character varying NOT NULL, "location" jsonb NOT NULL, "authorityId" uuid, "hospitalId" uuid, "departmentId" uuid, CONSTRAINT "PK_c9dcacb09fe290b927902c5802a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "training_site_time_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "trainingSiteId" uuid, CONSTRAINT "PK_631b94cb7e24e2e276309f635dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "placement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "studentId" uuid, "trainingSiteId" uuid, "timeSlotId" uuid, CONSTRAINT "PK_4f8b29ee2db5213bcb38b6c71c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "courseId" uuid, CONSTRAINT "PK_140d2607308f60eda2ae0d72a4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "identity" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_940639e2ce4b06e9857bbef0c9" UNIQUE ("userId"), CONSTRAINT "PK_48e055651592504b63f3910d204" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_1693b3f4b707af5acfb078771f9" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hospital" ADD CONSTRAINT "FK_4f999670297862206846b6d497c" FOREIGN KEY ("authorityId") REFERENCES "authority"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_85375b5d387e2414ee1956fbd1f" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_d4a26a97f62cf4c29fdf05f09cf" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" ADD CONSTRAINT "FK_38e4b26a6970395f3daf0bc327c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" ADD CONSTRAINT "FK_b20164f92cf18450381711c5040" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" ADD CONSTRAINT "FK_9198de661ce93690d97e0934962" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5" FOREIGN KEY ("departmentId") REFERENCES "college_departent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_04b79a1d2c983390eb7b7a49ee9" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" ADD CONSTRAINT "FK_616c555debd68322d15bdb4a1f1" FOREIGN KEY ("coordinatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" ADD CONSTRAINT "FK_d741b1b18024fb6003c651ca6d7" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD CONSTRAINT "FK_aa3c30ea969f1979a9b419f7150" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department_units" ADD CONSTRAINT "FK_bb0322472ee15f830e3ffb7729a" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_site" ADD CONSTRAINT "FK_f93a4ac7b06d53c54967f04d16e" FOREIGN KEY ("authorityId") REFERENCES "authority"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_site" ADD CONSTRAINT "FK_c475d8a1f8f4fc5b6a4c4874859" FOREIGN KEY ("hospitalId") REFERENCES "hospital"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_site" ADD CONSTRAINT "FK_da591ace3e2e69e82c9c7a057be" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "training_site_time_slot" ADD CONSTRAINT "FK_24dafc87f70d62d7e23dbb717b8" FOREIGN KEY ("trainingSiteId") REFERENCES "training_site"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_fdd1cd12e6087ef11345a587150" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_6ef85a593f8f5832c67767be581" FOREIGN KEY ("trainingSiteId") REFERENCES "training_site"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_78389f82d0709a6be82ffbdc0ee" FOREIGN KEY ("timeSlotId") REFERENCES "training_site_time_slot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_course" ADD CONSTRAINT "FK_fe1f74de2fd433ac16a7260d268" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_course" ADD CONSTRAINT "FK_01b917cdbb6a420e3857788da1b" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_profile" ADD CONSTRAINT "FK_940639e2ce4b06e9857bbef0c90" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_profile" DROP CONSTRAINT "FK_940639e2ce4b06e9857bbef0c90"`);
        await queryRunner.query(`ALTER TABLE "student_course" DROP CONSTRAINT "FK_01b917cdbb6a420e3857788da1b"`);
        await queryRunner.query(`ALTER TABLE "student_course" DROP CONSTRAINT "FK_fe1f74de2fd433ac16a7260d268"`);
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_78389f82d0709a6be82ffbdc0ee"`);
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_6ef85a593f8f5832c67767be581"`);
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_fdd1cd12e6087ef11345a587150"`);
        await queryRunner.query(`ALTER TABLE "training_site_time_slot" DROP CONSTRAINT "FK_24dafc87f70d62d7e23dbb717b8"`);
        await queryRunner.query(`ALTER TABLE "training_site" DROP CONSTRAINT "FK_da591ace3e2e69e82c9c7a057be"`);
        await queryRunner.query(`ALTER TABLE "training_site" DROP CONSTRAINT "FK_c475d8a1f8f4fc5b6a4c4874859"`);
        await queryRunner.query(`ALTER TABLE "training_site" DROP CONSTRAINT "FK_f93a4ac7b06d53c54967f04d16e"`);
        await queryRunner.query(`ALTER TABLE "department_units" DROP CONSTRAINT "FK_bb0322472ee15f830e3ffb7729a"`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP CONSTRAINT "FK_aa3c30ea969f1979a9b419f7150"`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" DROP CONSTRAINT "FK_d741b1b18024fb6003c651ca6d7"`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" DROP CONSTRAINT "FK_616c555debd68322d15bdb4a1f1"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_04b79a1d2c983390eb7b7a49ee9"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5"`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" DROP CONSTRAINT "FK_9198de661ce93690d97e0934962"`);
        await queryRunner.query(`ALTER TABLE "coordinator_college_department" DROP CONSTRAINT "FK_b20164f92cf18450381711c5040"`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_38e4b26a6970395f3daf0bc327c"`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_d4a26a97f62cf4c29fdf05f09cf"`);
        await queryRunner.query(`ALTER TABLE "supervisor_profile" DROP CONSTRAINT "FK_85375b5d387e2414ee1956fbd1f"`);
        await queryRunner.query(`ALTER TABLE "user_documents" DROP CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e"`);
        await queryRunner.query(`ALTER TABLE "hospital" DROP CONSTRAINT "FK_4f999670297862206846b6d497c"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_1693b3f4b707af5acfb078771f9"`);
        await queryRunner.query(`DROP TABLE "student_profile"`);
        await queryRunner.query(`DROP TABLE "student_course"`);
        await queryRunner.query(`DROP TABLE "placement"`);
        await queryRunner.query(`DROP TABLE "training_site_time_slot"`);
        await queryRunner.query(`DROP TABLE "training_site"`);
        await queryRunner.query(`DROP TABLE "department_units"`);
        await queryRunner.query(`DROP TABLE "coordinator_profile"`);
        await queryRunner.query(`DROP TABLE "coordinator_course"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "semester"`);
        await queryRunner.query(`DROP TYPE "public"."semester_semester_enum"`);
        await queryRunner.query(`DROP TABLE "coordinator_college_department"`);
        await queryRunner.query(`DROP TABLE "college_departent"`);
        await queryRunner.query(`DROP TABLE "supervisor_profile"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_documents"`);
        await queryRunner.query(`DROP TYPE "public"."user_documents_status_enum"`);
        await queryRunner.query(`DROP TABLE "authority"`);
        await queryRunner.query(`DROP TABLE "hospital"`);
        await queryRunner.query(`DROP TABLE "department"`);
    }

}
