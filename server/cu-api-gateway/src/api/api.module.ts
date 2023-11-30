import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FeedModule } from './feed/feed.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    FeedModule,
    UsersModule,
    StorageModule,
    NotificationsModule,
  ],
  exports: [
    AuthModule,
    ChatModule,
    FeedModule,
    UsersModule,
    StorageModule,
    NotificationsModule,
  ],
})
export class ApiModule {}
