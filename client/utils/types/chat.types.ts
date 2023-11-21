import { IUser } from "./user.types";

export declare enum MediaMessageTypes {
  VOICE = "VOICE",
  PHOTO = "PHOTO",
  VIDEO = "VIDEO",
  FILE = "FILE",
}

export interface MediaData {
  type: MediaMessageTypes;
  meta: Object;
}

export interface IMessage {
  user: IUser;
  text: string;
  media: MediaData[];
  seen: boolean;
  me: boolean;
  createdAt: string;
}
export interface IChat {
  id: number;
  users: IUser[];
}

export interface IChatResponse {
  friend: IUser;
  chat?: IChat;
  newMessagesCount: number;
  lastMessage?: IMessage;
  inChat?: boolean;
}

export interface IMessageRequest {
  text: string;
  media: MediaData[];
}
