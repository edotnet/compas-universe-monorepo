import { MigrationInterface, QueryRunner } from "typeorm";

export class Notifications1700227271298 implements MigrationInterface {
    name = 'Notifications1700227271298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('FRIEND_REQUEST')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."notifications_type_enum" NOT NULL, "read" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "content" jsonb, "userId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
