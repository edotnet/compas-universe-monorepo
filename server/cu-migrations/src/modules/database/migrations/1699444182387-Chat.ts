import { MigrationInterface, QueryRunner } from "typeorm";

export class Chat1699444182387 implements MigrationInterface {
    name = 'Chat1699444182387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying, "archived" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-chats" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "inChat" boolean NOT NULL, "chatId" integer, "userId" integer, CONSTRAINT "PK_4e5abd6d24a616be5fa1aac4110" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-chats" ADD CONSTRAINT "FK_81196b95df7b1627a4cabcfcdb2" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user-chats" ADD CONSTRAINT "FK_393611769af5e94019b4358ec0e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-chats" DROP CONSTRAINT "FK_393611769af5e94019b4358ec0e"`);
        await queryRunner.query(`ALTER TABLE "user-chats" DROP CONSTRAINT "FK_81196b95df7b1627a4cabcfcdb2"`);
        await queryRunner.query(`DROP TABLE "user-chats"`);
        await queryRunner.query(`DROP TABLE "chats"`);
    }

}
