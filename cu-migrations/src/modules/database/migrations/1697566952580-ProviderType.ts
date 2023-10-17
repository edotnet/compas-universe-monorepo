import { MigrationInterface, QueryRunner } from "typeorm";

export class ProviderType1697566952580 implements MigrationInterface {
    name = 'ProviderType1697566952580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."providers_name_enum" RENAME TO "providers_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."providers_name_enum" AS ENUM('GOOGLE', 'FACEBOOK')`);
        await queryRunner.query(`ALTER TABLE "providers" ALTER COLUMN "name" TYPE "public"."providers_name_enum" USING "name"::"text"::"public"."providers_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."providers_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."providers_name_enum_old" AS ENUM('GOOGLE')`);
        await queryRunner.query(`ALTER TABLE "providers" ALTER COLUMN "name" TYPE "public"."providers_name_enum_old" USING "name"::"text"::"public"."providers_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."providers_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."providers_name_enum_old" RENAME TO "providers_name_enum"`);
    }

}
