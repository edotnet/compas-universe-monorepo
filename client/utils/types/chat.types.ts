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
  text: string;
  media: MediaData;
  seen: boolean;
}

export interface IMessageResponse extends IMessage {
  user: IUser;
  me: boolean;
  createdAt: Date;
}

export interface IChat {
  id: number;
  users: IUser[];
}

export interface IChatResponse {
  friend: IUser;
  chat: IChat;
  lastMessage: IMessageResponse;
}

export interface IMessageRequest {
  text: string;
  media: MediaData[];
}
