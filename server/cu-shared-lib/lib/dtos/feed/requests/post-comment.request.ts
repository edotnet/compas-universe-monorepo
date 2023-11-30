import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class PostCommentRequest {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  postId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  commentId: number;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @MaxLength(256)
  content: string;
}
