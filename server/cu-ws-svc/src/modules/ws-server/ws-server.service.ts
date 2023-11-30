import { Inject, Injectable } from '@nestjs/common';
import { WsServerGateway } from './ws-server.gateway';
import {
  EventsMessage,
  MESSAGE_SEEN,
  MESSAGE_SEEN_EVENT,
  MessageEvent,
  MessageNewResponse,
  MessageSeenEvent,
  MessageSeenResponse,
  MESSAGE_NEW,
  MESSAGE_NEW_EVENT,
  NOTIFICATION_NEW,
  NOTIFICATION_NEW_EVENT,
  NotificationEvent,
  NotificationNewResponse,
} from '@edotnet/shared-lib';

@Injectable()
export class WsServerService {
  constructor(@Inject(WsServerGateway) private gateway: WsServerGateway) {}

  @EventsMessage(MESSAGE_NEW_EVENT, 'ws')
  async newMessage(event: MessageEvent) {
    this.gateway.emit<MessageNewResponse>({
      message: MESSAGE_NEW,
      data: {
        message: event.message,
        chatId: event.chatId,
        ...(!event.message.me && { friendId: event.userId }),
        inChat: event.inChat,
      },
      receiver: {
        userId: event.userId,
      },
    });
  }

  @EventsMessage(MESSAGE_SEEN_EVENT, 'ws')
  async messageSeen(event: MessageSeenEvent) {
    this.gateway.emit<MessageSeenResponse>({
      message: MESSAGE_SEEN,
      data: {
        message: event.message,
        chatId: event.chatId,
      },
      receiver: {
        userId: event.userId,
      },
    });
  }

  @EventsMessage(NOTIFICATION_NEW_EVENT, 'ws')
  async notification(event: NotificationEvent) {
    this.gateway.emit<NotificationNewResponse>({
      message: NOTIFICATION_NEW,
      data: {
        notification: event.notification,
      },
      receiver: {
        userId: event.userId,
      },
    });
  }
}
