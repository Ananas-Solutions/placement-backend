import { MigrationInterface, QueryRunner } from 'typeorm';

export class authorityTableInitialsColumn1638943610504
  implements MigrationInterface
{
  name = 'authorityTableInitialsColumn1638943610504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authority" ADD "initials" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "authority" ALTER COLUMN "initials" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authority" ALTER COLUMN "initials" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "authority" DROP COLUMN "initials"`);
  }
}
