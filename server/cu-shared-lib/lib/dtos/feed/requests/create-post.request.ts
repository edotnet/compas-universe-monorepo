import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from "class-validator";
import { MediaData } from "../../../entities";
import { AtLeastOne } from "../../../decorator";

export class CreatePostRequest {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @MaxLength(1500)
  @Validate(AtLeastOne("description", "media"))
  description: string;

  @IsOptional()
  @IsArray()
  @Type(() => MediaData)
  @Validate(AtLeastOne("description", "media"))
  media: MediaData[];
}
