import { IsNumber } from "class-validator";

export class CreateChatRequest {
  @IsNumber()
  friendId: number;
}
