import { Module } from '@nestjs/common';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModule } from 'nestjs-pino';
import { WsServerModule } from './modules/ws-server/ws-server.module';
import {
  CustomLoggerService,
  ErrorFilter,
  EventsModule,
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
      name: 'WS_SVC',
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
    AsyncHooksModule,
    AsyncHooksModule,
    EventsModule,
    WsServerModule,
    ServicesModule,
    ...logger,
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
