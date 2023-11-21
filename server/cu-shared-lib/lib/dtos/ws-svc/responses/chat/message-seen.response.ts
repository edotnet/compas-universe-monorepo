import { IsNotEmpty } from "class-validator";
import { ExtendedMessageResponse } from "../../../chat.response";

export class MessageSeenResponse {
  @IsNotEmpty()
  message: ExtendedMessageResponse;

  @IsNotEmpty()
  chatId: number;
}
