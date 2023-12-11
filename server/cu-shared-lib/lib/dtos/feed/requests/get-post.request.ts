import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { QueryRequest } from "../../query.request";

export class GetPostRequest extends QueryRequest {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  postId: number;
}
