import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsEventsService } from './notifications-events.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsEventsService],
  exports: [NotificationsService, NotificationsEventsService],
})
export class NotificationsModule {}
