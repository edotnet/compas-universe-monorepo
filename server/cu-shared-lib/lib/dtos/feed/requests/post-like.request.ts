import { IsNumber, IsOptional, Validate } from "class-validator";
import { OneOf } from "../../../decorator";
import { Type } from "class-transformer";

export class PostLikeRequest {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Validate(OneOf("postId", "commentId"))
  postId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Validate(OneOf("postId", "commentId"))
  commentId: number;
}
