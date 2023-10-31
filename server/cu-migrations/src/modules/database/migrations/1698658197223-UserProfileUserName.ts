import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfileUserName1698658197223 implements MigrationInterface {
  name = "UserProfileUserName1698658197223";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
    await queryRunner.query(
      `ALTER TABLE "user-profiles" ADD "userName" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-profiles" DROP COLUMN "userName"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userName" character varying`
    );
  }
}
