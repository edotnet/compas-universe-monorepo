import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class SwitchActiveChatRequest {
  @IsNumber()
  @Type(() => Number)
  chatId: number;
}
