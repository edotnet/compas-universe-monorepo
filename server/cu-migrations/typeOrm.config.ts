import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { entitiesPostgres } from "@edotnet/shared-lib";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get<string>("POSTGRES_HOST"),
  port: configService.get<number>("POSTGRES_PORT"),
  username: configService.get<string>("POSTGRES_USER"),
  password: configService.get<string>("POSTGRES_PASSWORD"),
  database: configService.get<string>("POSTGRES_DATABASE"),
  entities: [...entitiesPostgres],
});
