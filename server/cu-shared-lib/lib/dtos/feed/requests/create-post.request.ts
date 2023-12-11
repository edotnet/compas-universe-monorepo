import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidateIf,
} from "class-validator";
import { MediaData } from "../../../entities";
import { AtLeastOne } from "../../../decorator";

export class CreatePostRequest {
  @Validate(AtLeastOne("description", "media"))
  @ValidateIf((o) => !o.media || o.description)
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @MaxLength(10000)
  description: string;

  @Validate(AtLeastOne("description", "media"))
  @ValidateIf((o) => !o.description || o.media)
  @IsArray()
  @Type(() => MediaData)
  media: MediaData[];
}
