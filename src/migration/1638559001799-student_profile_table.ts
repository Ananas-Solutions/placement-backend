import {MigrationInterface, QueryRunner} from "typeorm";

export class studentProfileTable1638559001799 implements MigrationInterface {
    name = 'studentProfileTable1638559001799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_profile" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "student_profile" ADD CONSTRAINT "UQ_940639e2ce4b06e9857bbef0c90" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "student_profile" ADD CONSTRAINT "FK_940639e2ce4b06e9857bbef0c90" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_profile" DROP CONSTRAINT "FK_940639e2ce4b06e9857bbef0c90"`);
        await queryRunner.query(`ALTER TABLE "student_profile" DROP CONSTRAINT "UQ_940639e2ce4b06e9857bbef0c90"`);
        await queryRunner.query(`ALTER TABLE "student_profile" DROP COLUMN "userId"`);
    }

}
