import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, Validate } from "class-validator";
import { MediaTypes } from "../../../entities";
import { UrlStartsWith } from "../../../decorator/constraints/url-starts-with.constraint";

export class File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}

export class UploadFileRequest {
  @IsEnum(MediaTypes)
  @IsNotEmpty()
  type: MediaTypes;

  @IsArray()
  @Type(() => File)
  @Validate(UrlStartsWith)
  @IsNotEmpty()
  files: File[];
}
