import { Inject, Injectable } from '@nestjs/common';
import { WsServerGateway } from './ws-server.gateway';
import {
  EventsMessage,
  MESSAGE_SEEN,
  MESSAGE_SEEN_EVENT,
  MessageEvent,
  MessageSeenEvent,
  NEW_MESSAGE,
  NEW_MESSAGE_EVENT,
} from '@edotnet/shared-lib';

@Injectable()
export class WsServerService {
  constructor(@Inject(WsServerGateway) private gateway: WsServerGateway) {}

  @EventsMessage(NEW_MESSAGE_EVENT, 'ws')
  async newMessage(event: MessageEvent) {
    this.gateway.emit({
      message: NEW_MESSAGE,
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
    this.gateway.emit({
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
}
