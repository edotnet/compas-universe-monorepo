import { IMessageResponse } from "./chat.types";

export interface IMessageEvent extends IMessageResponse{
    chatId: number
}