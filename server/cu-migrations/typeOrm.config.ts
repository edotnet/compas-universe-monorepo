import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { User } from "./src/modules/database/entities/user.entity";
import { UserProfile } from "./src/modules/database/entities/user-profile.entity";
import { UserProvider } from "./src/modules/database/entities/user-provider.entity";
import { Provider } from "./src/modules/database/entities/provider.entity";
import { UserFollower } from "./src/modules/database/entities/user-followers";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get<string>("POSTGRES_HOST"),
  port: configService.get<number>("POSTGRES_PORT"),
  username: configService.get<string>("POSTGRES_USER"),
  password: configService.get<string>("POSTGRES_PASSWORD"),
  database: configService.get<string>("POSTGRES_DATABASE"),
  entities: [User, UserProfile, UserProvider, Provider, UserFollower],
});
