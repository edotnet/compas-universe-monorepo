import { IMessage } from "./chat.types";
import { INotification } from "./notification.types";

export interface IMessageEvent {
  message: IMessage;
  chatId: number;
  inChat: boolean;
  friendId?: number;
}

export interface INotificationEvent {
  notification: INotification;
}
