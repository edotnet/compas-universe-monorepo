import { MigrationInterface, QueryRunner } from "typeorm";

export class Feed1701181911119 implements MigrationInterface {
    name = 'Feed1701181911119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post-likes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deleted" boolean NOT NULL DEFAULT false, "postId" integer, "userId" integer, CONSTRAINT "PK_2591cc84f76eac5b549d07ca5cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post-comment-likes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deleted" boolean NOT NULL DEFAULT false, "commentId" integer, "userId" integer, CONSTRAINT "PK_577bcff170c77cc843e505828c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post-comments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "content" character varying NOT NULL, "deleted" boolean NOT NULL DEFAULT false, "postId" integer, "replyToId" integer, "userId" integer, CONSTRAINT "PK_bbe67b1fa5641e3c091589b1dac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."posts_type_enum" AS ENUM('CUSTOM')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."posts_type_enum" NOT NULL, "content" jsonb, "userId" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post-likes" ADD CONSTRAINT "FK_edf2f001f38b1d5fb21920d9812" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-likes" ADD CONSTRAINT "FK_168ef75f790ea16727ba347bc2d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-comment-likes" ADD CONSTRAINT "FK_327cc558efd37e686b9e5c36c6a" FOREIGN KEY ("commentId") REFERENCES "post-comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-comment-likes" ADD CONSTRAINT "FK_d80a702322b9696ded2a9404083" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-comments" ADD CONSTRAINT "FK_1e8a0191a29feda8b2b7a91b9a7" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-comments" ADD CONSTRAINT "FK_e4ad87375ba4016b7ee2319786a" FOREIGN KEY ("replyToId") REFERENCES "post-comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post-comments" ADD CONSTRAINT "FK_09a2c0048aede5447bbd7a6fc2d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
        await queryRunner.query(`ALTER TABLE "post-comments" DROP CONSTRAINT "FK_09a2c0048aede5447bbd7a6fc2d"`);
        await queryRunner.query(`ALTER TABLE "post-comments" DROP CONSTRAINT "FK_e4ad87375ba4016b7ee2319786a"`);
        await queryRunner.query(`ALTER TABLE "post-comments" DROP CONSTRAINT "FK_1e8a0191a29feda8b2b7a91b9a7"`);
        await queryRunner.query(`ALTER TABLE "post-comment-likes" DROP CONSTRAINT "FK_d80a702322b9696ded2a9404083"`);
        await queryRunner.query(`ALTER TABLE "post-comment-likes" DROP CONSTRAINT "FK_327cc558efd37e686b9e5c36c6a"`);
        await queryRunner.query(`ALTER TABLE "post-likes" DROP CONSTRAINT "FK_168ef75f790ea16727ba347bc2d"`);
        await queryRunner.query(`ALTER TABLE "post-likes" DROP CONSTRAINT "FK_edf2f001f38b1d5fb21920d9812"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_type_enum"`);
        await queryRunner.query(`DROP TABLE "post-comments"`);
        await queryRunner.query(`DROP TABLE "post-comment-likes"`);
        await queryRunner.query(`DROP TABLE "post-likes"`);
    }

}
