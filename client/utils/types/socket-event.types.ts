import { IMessage } from "./chat.types";

export interface IMessageEvent {
  message: IMessage;
  chatId: number;
}
