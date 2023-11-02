import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FriendRequest {
  @IsNumber()
  @Type(() => Number)
  friendId: number;
}
