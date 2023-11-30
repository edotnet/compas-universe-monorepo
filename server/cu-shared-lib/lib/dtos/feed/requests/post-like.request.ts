import { IsNumber, IsOptional, Validate } from "class-validator";
import { AtLeastOne } from "../../../decorator";
import { Type } from "class-transformer";

export class PostLikeRequest {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Validate(AtLeastOne("postId", "commentId"))
  postId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Validate(AtLeastOne("postId", "commentId"))
  commentId: number;
}
