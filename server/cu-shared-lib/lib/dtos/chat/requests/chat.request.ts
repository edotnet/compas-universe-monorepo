import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class ChatRequest {
  @IsNumber()
  @Type(() => Number)
  chatId: number;
}
