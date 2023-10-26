import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis/dist';
import { TransactionsModule, TransactionsService } from './transactions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BullModule } from '@nestjs/bull';
import { Provider } from './entities/provider.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UserProfile } from './entities/user-profile.entity';
import { TransactionsServiceName } from '@edotnet/shared-lib';
@Module({
  imports: [
    BullModule.registerQueue({
      name: TransactionsServiceName,
    }),
    TypeOrmModule.forFeature([User, Provider, UserProvider, UserProfile]),
    TransactionsModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PREFIX,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, TransactionsService],
  exports: [UserService],
})
export class UserModule {}
