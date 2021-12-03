import {MigrationInterface, QueryRunner} from "typeorm";

export class authorityTable1638509372883 implements MigrationInterface {
    name = 'authorityTable1638509372883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authority" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "authority"`);
    }

}
