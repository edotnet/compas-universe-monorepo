import { Module } from '@nestjs/common';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import {
  ServicesModule,
  CustomLoggerService,
  ErrorFilter,
  HttpErrorFilter,
  LoggerInterceptor,
  QueryErrorFilter,
  RpcErrorFilter,
  ValidationPipeHybrid,
} from '@edotnet/shared-lib';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

const logger = [
  LoggerModule.forRoot({
    pinoHttp: {
      name: 'SCHEDULER',
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
  imports: [AsyncHooksModule, ScheduleModule, ServicesModule, ...logger],
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
  exports: [ScheduleModule],
})
export class AppModule {}
