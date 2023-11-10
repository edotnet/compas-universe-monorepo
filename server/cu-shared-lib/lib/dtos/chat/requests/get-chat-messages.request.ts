import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetChatMessagesRequest {
  @IsNumber()
  @Type(() => Number)
  chatId: number;
}
