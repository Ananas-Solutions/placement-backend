import {MigrationInterface, QueryRunner} from "typeorm";

export class semesterTable1638973536990 implements MigrationInterface {
    name = 'semesterTable1638973536990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."semester_semester_enum" AS ENUM('FALL', 'SPRING', 'SUMMER')`);
        await queryRunner.query(`CREATE TABLE "semester" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "semester" "public"."semester_semester_enum" NOT NULL, "year" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9129c1fd35aa4aded7a9825b38d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "semester"`);
        await queryRunner.query(`DROP TYPE "public"."semester_semester_enum"`);
    }

}
