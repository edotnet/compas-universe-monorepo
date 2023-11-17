import { IsNotEmpty } from "class-validator";
import { UserResponse, mapUserToUserResponse } from "./user.response";
import { Chat, ChatMessages, MediaData } from "../entities";

export class ChatResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  users: UserResponse[];
}

export class MessageResponse {
  @IsNotEmpty()
  user: UserResponse;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  seen: boolean;

  @IsNotEmpty()
  media: MediaData[];

  @IsNotEmpty()
  createdAt: Date;
}

export class ExtendedMessageResponse extends MessageResponse {
  @IsNotEmpty()
  me: boolean;
}

export const mapChatMessageToChatMessageResponse = (
  message: ChatMessages
): MessageResponse => ({
  user: message.user,
  text: message.text,
  media: message.media,
  seen: message.seen,
  createdAt: message.createdAt,
});

export const mapChatToChatResponse = (chat: Chat): ChatResponse => ({
  id: chat.id,
  users: chat.users.map((u) => mapUserToUserResponse(u.user)),
});
