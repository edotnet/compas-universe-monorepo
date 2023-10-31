import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFollowers1698401130394 implements MigrationInterface {
    name = 'UserFollowers1698401130394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-followers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "followingId" integer, "followerId" integer, CONSTRAINT "PK_68b8d1046440ed779d7ae5a368f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_type_enum" AS ENUM('Singer')`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ADD "type" "public"."user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user-profiles" ADD "profilePicture" character varying`);
        await queryRunner.query(`ALTER TABLE "user-followers" ADD CONSTRAINT "FK_fc0f027524cdecc3acc49dbfcc6" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-followers" ADD CONSTRAINT "FK_29c85f2ed7737a08b6da76b9206" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-followers" DROP CONSTRAINT "FK_29c85f2ed7737a08b6da76b9206"`);
        await queryRunner.query(`ALTER TABLE "user-followers" DROP CONSTRAINT "FK_fc0f027524cdecc3acc49dbfcc6"`);
        await queryRunner.query(`ALTER TABLE "user-profiles" DROP COLUMN "profilePicture"`);
        await queryRunner.query(`ALTER TABLE "user-profiles" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
        await queryRunner.query(`DROP TABLE "user-followers"`);
    }

}
