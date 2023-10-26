import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPasswordUserName1697729013530 implements MigrationInterface {
  name = "UserPasswordUserName1697729013530";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userName" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
