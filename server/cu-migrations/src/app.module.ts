import { Module } from "@nestjs/common";
import { AsyncHooksModule } from "@nestjs-steroids/async-context";
import { LoggerModule } from "nestjs-pino";
import { v4 as uuidv4 } from "uuid";
import { DatabaseModule } from "./modules/database/database.module";
import { CustomLoggerService, ErrorFilter, HttpErrorFilter, LoggerInterceptor, QueryErrorFilter, RpcErrorFilter, ValidationPipeHybrid } from "@edotnet/shared-lib";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

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
  providers: [
    CustomLoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: RpcErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipeHybrid,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
