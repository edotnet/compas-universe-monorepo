import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class GetChatsRequest {
  @IsOptional()
  @IsString()
  @Type(() => String)
  searchTerm: string;
}
