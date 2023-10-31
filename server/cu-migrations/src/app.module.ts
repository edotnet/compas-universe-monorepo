import { Module } from "@nestjs/common";
import { AsyncHooksModule } from "@nestjs-steroids/async-context";
import { LoggerModule } from "nestjs-pino";
import { v4 as uuidv4 } from "uuid";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: "MIGRATIONS",
        autoLogging: false,
        genReqId: (request) => {
          return uuidv4();
        },
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        prettyPrint:
          process.env.NODE_ENV === "development"
            ? {
                colorize: true,
                levelFirst: true,
                translateTime: true,
              }
            : false,
      },
    }),
    AsyncHooksModule,
    DatabaseModule,
  ],
})
export class AppModule {}
