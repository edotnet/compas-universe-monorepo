import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class SendMessageRequest {
  @IsNumber()
  @Type(() => Number)
  chatId: number;

  @IsString()
  @Type(() => String)
  text: string;
}
