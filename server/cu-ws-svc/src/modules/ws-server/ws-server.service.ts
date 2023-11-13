import { Inject, Injectable } from '@nestjs/common';
import { WsServerGateway } from './ws-server.gateway';
import {
  EventsMessage,
  MessageEvent,
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
        user: event.user,
        ...event.message,
        chatId: event.chatId,
      },
      receiver: {
        userIds: event.userIds,
      },
    });
  }
}
