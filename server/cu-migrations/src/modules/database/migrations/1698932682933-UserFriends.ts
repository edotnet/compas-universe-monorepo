import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFriends1698932682933 implements MigrationInterface {
    name = 'UserFriends1698932682933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user-friends_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "user-friends" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."user-friends_status_enum" NOT NULL DEFAULT 'PENDING', "userId" integer, "friendId" integer, CONSTRAINT "PK_44d1a9871eba7bc3f6b09d28f5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-friends" ADD CONSTRAINT "FK_52ea711426c47d975e58dac5b09" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-friends" ADD CONSTRAINT "FK_b138b780b9c7d07e04c2c33a202" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-friends" DROP CONSTRAINT "FK_b138b780b9c7d07e04c2c33a202"`);
        await queryRunner.query(`ALTER TABLE "user-friends" DROP CONSTRAINT "FK_52ea711426c47d975e58dac5b09"`);
        await queryRunner.query(`DROP TABLE "user-friends"`);
        await queryRunner.query(`DROP TYPE "public"."user-friends_status_enum"`);
    }

}
