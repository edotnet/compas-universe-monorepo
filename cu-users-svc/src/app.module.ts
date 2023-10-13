import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModule } from 'nestjs-pino';

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
  imports: [AsyncHooksModule, UserModule, ...logger],
  exports: [UserModule],
})
export class AppModule {}
