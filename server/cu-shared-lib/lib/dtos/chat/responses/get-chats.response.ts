import { IsNotEmpty } from "class-validator";
import {
  ChatResponse,
  ExtendedMessageResponse,
} from "../../chat.response";
import { UserResponse } from "../../user.response";

export class GetChatMessageResponse extends ExtendedMessageResponse {
  @IsNotEmpty()
  user: UserResponse;
}

export class GetChatsResponse {
  @IsNotEmpty()
  chat: ChatResponse;

  @IsNotEmpty()
  friend: UserResponse;

  @IsNotEmpty()
  lastMessage: GetChatMessageResponse;
}
