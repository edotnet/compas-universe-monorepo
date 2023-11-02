import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import {
  CustomLoggerService,
  ErrorFilter,
  HttpErrorFilter,
  LoggerInterceptor,
  QueryErrorFilter,
  RpcErrorFilter,
  ServicesModule,
  ValidationPipeHybrid,
} from '@edotnet/shared-lib';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

const logger = [
  LoggerModule.forRoot({
    pinoHttp: {
      name: 'USERS_SVC',
      autoLogging: false,
      genReqId: (request) => {
        const asyncHook: AsyncContext = AsyncContext.getInstance();
        const id = uuidv4();
        asyncHook.register();
        asyncHook.set('reqId', id);
        return id;
      },
      level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      prettyPrint:
        process.env.NODE_ENV === 'development'
          ? {
              colorize: true,
              levelFirst: true,
              translateTime: true,
            }
          : false,
    },
  }),
];

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          db: parseInt(process.env.REDIS_DB),
          keyPrefix: process.env.REDIS_PREFIX,
          password: process.env.REDIS_PASSWORD,
        },
        limiter: {
          max: 5,
          duration: 500,
        },
      }),
    }),
    ServicesModule,
    AsyncHooksModule,
    UserModule,
    ...logger,
  ],
  exports: [UserModule],
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
