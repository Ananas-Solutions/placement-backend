import {MigrationInterface, QueryRunner} from "typeorm";

export class authorityTableCreatedAtColumn1638509749686 implements MigrationInterface {
    name = 'authorityTableCreatedAtColumn1638509749686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authority" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "authority" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authority" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "authority" DROP COLUMN "createAt"`);
    }

}
