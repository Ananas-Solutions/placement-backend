import {MigrationInterface, QueryRunner} from "typeorm";

export class courseStudentTable1638555724968 implements MigrationInterface {
    name = 'courseStudentTable1638555724968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_course" DROP CONSTRAINT "FK_10a2e930120da62230ad8edafe9"`);
        await queryRunner.query(`ALTER TABLE "student_course" RENAME COLUMN "userId" TO "studentId"`);
        await queryRunner.query(`ALTER TABLE "student_course" ADD CONSTRAINT "FK_fe1f74de2fd433ac16a7260d268" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_course" DROP CONSTRAINT "FK_fe1f74de2fd433ac16a7260d268"`);
        await queryRunner.query(`ALTER TABLE "student_course" RENAME COLUMN "studentId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "student_course" ADD CONSTRAINT "FK_10a2e930120da62230ad8edafe9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
