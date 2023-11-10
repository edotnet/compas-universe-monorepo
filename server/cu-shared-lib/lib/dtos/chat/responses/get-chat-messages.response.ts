import { IsNotEmpty } from "class-validator";
import { MessageResponse } from "./get-chats.response";

export class GetChatMessagesResponse extends MessageResponse {
  @IsNotEmpty()
  me: boolean;

  @IsNotEmpty()
  createdAt: Date;
}
