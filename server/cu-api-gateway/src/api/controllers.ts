import { ChatController } from './chat/chat.controller';
import { FeedController } from './feed/feed.controller';
import { UsersController } from './users/users.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { StorageController } from './storage/storage.controller';

export const controllers = [
  ChatController,
  FeedController,
  UsersController,
  StorageController,
  NotificationsController,
];
