import { IsNumber, IsOptional } from "class-validator";
import { QueryRequest } from "../../query.request";
import { Type } from "class-transformer";

export class GetNoneFriendsRequest extends QueryRequest {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    friendId: number
}