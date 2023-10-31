import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { v4 as uuidv4 } from 'uuid';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ServicesModule } from '@edotnet/shared-lib';

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
    // ServicesModule,
    TypeOrmModule.forRootAsync({
      useFactory: (logger): TypeOrmModuleOptions => ({
        logging:
          false && logger && ((sql: string): void => logger.log(sql, 'SQL')),
        type: 'postgres',
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
          'dist/**/*.model{.ts,.js}',
          'src/modules/entities/**/*.entity{.ts,.js}',
        ],
        synchronize: false,
        retryAttempts: 100,
        retryDelay: 10000,
        autoLoadEntities: true,
      }),
    }),
    AsyncHooksModule,
    UserModule,
    ...logger,
  ],
  exports: [UserModule],
})
export class AppModule {}
