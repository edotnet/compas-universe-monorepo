import { IsArray, IsNumber } from "class-validator";

export class CreateChatRequest {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
