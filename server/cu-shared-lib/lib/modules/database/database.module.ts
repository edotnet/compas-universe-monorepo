import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { entitiesMongo, entitiesPostgres } from "../../entities";
import { MongooseModule } from "@nestjs/mongoose";

const LOG_SQL_QUERIES = false;

const getPostgresOrmConfig = () => ({
  useFactory: (logger): TypeOrmModuleOptions => ({
    logging:
      LOG_SQL_QUERIES &&
      logger &&
      ((sql: string): void => logger.log(sql, "SQL")),
    type: "postgres",
    replication: {
      master: {
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
      },
      slaves: [
        {
          host: process.env.POSTGRES_HOST_REPLICA
            ? process.env.POSTGRES_HOST_REPLICA
            : process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
        },
      ],
    },
    entities: [
      "dist/**/*.model{.ts,.js}",
      "node_modules/@edotnet/shared-lib/dist/entities/postgres/**/*.entity{.ts,.js}",
    ],
    synchronize: false,
    retryAttempts: 100,
    retryDelay: 10000,
    autoLoadEntities: true,
  }),
});

const dynamicModules = TypeOrmModule.forFeature(entitiesPostgres);
const dynamicModulesMongoose = MongooseModule.forFeature(entitiesMongo);

@Module({
  imports: [
    TypeOrmModule.forRootAsync(getPostgresOrmConfig()),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    dynamicModules,
    dynamicModulesMongoose,
  ],
  exports: [dynamicModules, dynamicModulesMongoose],
})
export class DatabaseModule {}
