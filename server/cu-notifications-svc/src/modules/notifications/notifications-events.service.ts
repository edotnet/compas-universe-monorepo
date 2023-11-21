import { Controller, Inject } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  EventsMessage,
  FRIEND_REQUEST_EVENT,
  FriendRequestEvent,
  NotificationsTypes,
} from '@edotnet/shared-lib';

@Controller()
export class NotificationsEventsService {
  constructor(
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @EventsMessage(FRIEND_REQUEST_EVENT, 'notifications')
  async friendRequestEvent(event: FriendRequestEvent) {
    const { friend, userId } = event;
    this.notificationsService.create({
      userId: friend.id,
      type: NotificationsTypes.FRIEND_REQUEST,
      content: { user: { id: userId }, friend },
    });
  }
}
