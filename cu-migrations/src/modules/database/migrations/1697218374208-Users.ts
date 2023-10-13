import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1697218374208 implements MigrationInterface {
    name = 'Users1697218374208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."providers_name_enum" AS ENUM('GOOGLE')`);
        await queryRunner.query(`CREATE TABLE "providers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" "public"."providers_name_enum" NOT NULL, CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-providers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "originalId" character varying NOT NULL, "raw" character varying NOT NULL, "providerId" integer, "userId" integer, CONSTRAINT "REL_8801f985b4292a2ead652ee601" UNIQUE ("userId"), CONSTRAINT "PK_7082ad4ff760026797b89ff2c99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-profiles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying, "userId" integer, CONSTRAINT "REL_28cb19aedf4cf921b56ddca264" UNIQUE ("userId"), CONSTRAINT "PK_e02efb8248338fe9e5831858ec1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'PENDING', 'CANCELLED', 'DEACTIVATED')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('OWNER', 'ADMIN', 'MEMBER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'MEMBER', CONSTRAINT "email" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-providers" ADD CONSTRAINT "FK_5867b6246a4c5be4c05bf239420" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-providers" ADD CONSTRAINT "FK_8801f985b4292a2ead652ee6015" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ADD CONSTRAINT "FK_28cb19aedf4cf921b56ddca2646" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-profiles" DROP CONSTRAINT "FK_28cb19aedf4cf921b56ddca2646"`);
        await queryRunner.query(`ALTER TABLE "user-providers" DROP CONSTRAINT "FK_8801f985b4292a2ead652ee6015"`);
        await queryRunner.query(`ALTER TABLE "user-providers" DROP CONSTRAINT "FK_5867b6246a4c5be4c05bf239420"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "user-profiles"`);
        await queryRunner.query(`DROP TABLE "user-providers"`);
        await queryRunner.query(`DROP TABLE "providers"`);
        await queryRunner.query(`DROP TYPE "public"."providers_name_enum"`);
    }

}
