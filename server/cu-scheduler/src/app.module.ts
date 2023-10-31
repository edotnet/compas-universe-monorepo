import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

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
  imports: [
    AsyncHooksModule,
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
    ScheduleModule,
    ...logger,
  ],
  exports: [ScheduleModule],
})
export class AppModule {}
