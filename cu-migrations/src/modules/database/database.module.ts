import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

const getOrmConfig = () => {
    return {
        useFactory: (logger): TypeOrmModuleOptions => ({
            logging: ["error", "warn", "migration"],
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
            autoLoadEntities: true,
            migrations: ['dist/src/modules/database/migrations/*{.ts,.js}'],
            migrationsRun: true,
            migrationsTransactionMode: 'none',
            synchronize: false,
            retryAttempts: 100,
            retryDelay: 10000,
        }),
    };
};

@Module({
    imports: [
        TypeOrmModule.forRootAsync(getOrmConfig()),
    ],
    exports: [],
})
export class DatabaseModule {
}
