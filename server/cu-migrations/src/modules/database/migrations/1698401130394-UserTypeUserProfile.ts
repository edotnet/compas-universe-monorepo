import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTypeUserProfile1698401130394 implements MigrationInterface {
  name = "UserTypeUserProfile1698401130394";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_enum" AS ENUM('Singer')`
    );
    await queryRunner.query(
      `ALTER TABLE "user-profiles" ADD "type" "public"."user_type_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "user-profiles" ADD "profilePicture" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-profiles" DROP COLUMN "profilePicture"`
    );
    await queryRunner.query(`ALTER TABLE "user-profiles" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
  }
}
