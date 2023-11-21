import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { ChatRequest } from "./chat.request";

export class SendMessageRequest extends ChatRequest {
  @IsString()
  @Type(() => String)
  text: string;
}
