import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FollowRequest {
  @IsNumber()
  @Type(() => Number)
  followingId: number;
}
