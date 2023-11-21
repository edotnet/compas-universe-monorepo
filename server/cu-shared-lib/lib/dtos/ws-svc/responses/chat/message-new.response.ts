import { IsNotEmpty } from "class-validator";
import { ExtendedMessageResponse } from "../../../chat.response";

export class MessageNewResponse {
  @IsNotEmpty()
  message: ExtendedMessageResponse;

  @IsNotEmpty()
  chatId: number;

  @IsNotEmpty()
  inChat: boolean;

  @IsNotEmpty()
  friendId?: number;
}
