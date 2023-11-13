import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis/dist';
import { EventsModule, TransactionsModule } from '@edotnet/shared-lib';
import { ChatService } from '../chat/chat.service';
@Module({
  imports: [
    TransactionsModule,
    EventsModule,
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
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
