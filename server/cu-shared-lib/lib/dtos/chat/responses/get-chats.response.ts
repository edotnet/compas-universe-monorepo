import { IsNotEmpty } from "class-validator";
import { ChatResponse, ExtendedMessageResponse } from "../../chat.response";
import { UserResponse } from "../../user.response";

export class GetChatsResponse {
  @IsNotEmpty()
  chat: ChatResponse;

  @IsNotEmpty()
  friend: UserResponse;

  @IsNotEmpty()
  lastMessage: ExtendedMessageResponse;

  @IsNotEmpty()
  newMessagesCount: number

  @IsNotEmpty()
  inChat: boolean
}
