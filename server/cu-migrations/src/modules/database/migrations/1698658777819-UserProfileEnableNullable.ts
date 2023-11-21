import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfileEnableNullable1698658777819 implements MigrationInterface {
    name = 'UserProfileEnableNullable1698658777819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."user_type_enum" RENAME TO "user_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user-profiles_type_enum" AS ENUM('Singer')`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "type" TYPE "public"."user-profiles_type_enum" USING "type"::"text"::"public"."user-profiles_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum_old" AS ENUM('Singer')`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "type" TYPE "public"."user_type_enum_old" USING "type"::"text"::"public"."user_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user-profiles_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_type_enum_old" RENAME TO "user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ALTER COLUMN "firstName" SET NOT NULL`);
    }

}
