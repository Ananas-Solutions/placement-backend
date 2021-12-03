import {MigrationInterface, QueryRunner} from "typeorm";

export class coordinatorCourseTable1638563222145 implements MigrationInterface {
    name = 'coordinatorCourseTable1638563222145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coordinator_course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "coordinatorId" uuid, "courseId" uuid, CONSTRAINT "PK_e18ed80af535d6224d82c24482f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "college" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_aa3c30ea969f1979a9b419f715" UNIQUE ("userId"), CONSTRAINT "PK_a1a131d873b24285b6e9234878c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" ADD CONSTRAINT "FK_616c555debd68322d15bdb4a1f1" FOREIGN KEY ("coordinatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" ADD CONSTRAINT "FK_d741b1b18024fb6003c651ca6d7" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_profile" ADD CONSTRAINT "FK_aa3c30ea969f1979a9b419f7150" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" DROP CONSTRAINT "FK_aa3c30ea969f1979a9b419f7150"`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" DROP CONSTRAINT "FK_d741b1b18024fb6003c651ca6d7"`);
        await queryRunner.query(`ALTER TABLE "coordinator_course" DROP CONSTRAINT "FK_616c555debd68322d15bdb4a1f1"`);
        await queryRunner.query(`DROP TABLE "coordinator_profile"`);
        await queryRunner.query(`DROP TABLE "coordinator_course"`);
    }

}
