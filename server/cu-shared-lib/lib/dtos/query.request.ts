import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class QueryRequest {
  @IsNumber()
  @Type(() => Number)
  skip: number = 0;

  @IsNumber()
  @Type(() => Number)
  take: number = 12;

  @IsString()
  @IsOptional()
  sort: string;

  @IsString()
  @IsOptional()
  order: "ASC" | "DESC" = "ASC";
}
