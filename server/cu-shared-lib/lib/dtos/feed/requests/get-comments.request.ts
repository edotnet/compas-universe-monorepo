import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { QueryRequest } from "../../query.request";

export class GetCommentsRequest extends QueryRequest {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  postId: number;
}
