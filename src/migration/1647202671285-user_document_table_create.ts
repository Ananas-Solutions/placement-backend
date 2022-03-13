import {MigrationInterface, QueryRunner} from "typeorm";

export class userDocumentTableCreate1647202671285 implements MigrationInterface {
    name = 'userDocumentTableCreate1647202671285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_documents" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_cea43819156528b63504c4afd4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "placement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "studentId" uuid, "trainingSiteId" uuid, "timeSlotId" uuid, CONSTRAINT "PK_4f8b29ee2db5213bcb38b6c71c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_fdd1cd12e6087ef11345a587150" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_6ef85a593f8f5832c67767be581" FOREIGN KEY ("trainingSiteId") REFERENCES "training_site"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "placement" ADD CONSTRAINT "FK_78389f82d0709a6be82ffbdc0ee" FOREIGN KEY ("timeSlotId") REFERENCES "training_site_time_slot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_78389f82d0709a6be82ffbdc0ee"`);
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_6ef85a593f8f5832c67767be581"`);
        await queryRunner.query(`ALTER TABLE "placement" DROP CONSTRAINT "FK_fdd1cd12e6087ef11345a587150"`);
        await queryRunner.query(`ALTER TABLE "user_documents" DROP CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e"`);
        await queryRunner.query(`DROP TABLE "placement"`);
        await queryRunner.query(`DROP TABLE "user_documents"`);
    }

}
