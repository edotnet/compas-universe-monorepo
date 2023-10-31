import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { entitiesPostgres } from "../../entities";

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

const dynamicModules = TypeOrmModule.forFeature([...entitiesPostgres]);

@Module({
  imports: [TypeOrmModule.forRootAsync(getPostgresOrmConfig()), dynamicModules],
  exports: [dynamicModules],
})
export class DatabaseModule {}
