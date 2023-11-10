import { IsNotEmpty } from "class-validator";
import { UserResponse, mapUserToUserResponse } from "./user.response";
import { Chat, ChatMessages } from "../entities";

export class ChatResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  users: UserResponse[];
}

export const mapChatMessageToChatMessageResponse = (
  message: ChatMessages
): Pick<ChatMessages, "text" | "media" | "seen"> => ({
  text: message.text,
  media: message.media,
  seen: message.seen,
});

export const mapChatToChatResponse = (chat: Chat): ChatResponse => ({
  id: chat.id,
  users: chat.users.map((u) => mapUserToUserResponse(u.user)),
});
