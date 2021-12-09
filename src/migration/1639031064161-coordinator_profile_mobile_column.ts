import {MigrationInterface, QueryRunner} from "typeorm";

export class coordinatorProfileMobileColumn1639031064161 implements MigrationInterface {
    name = 'coordinatorProfileMobileColumn1639031064161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" RENAME COLUMN "college" TO "mobile"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_profile" RENAME COLUMN "mobile" TO "college"`);
    }

}
