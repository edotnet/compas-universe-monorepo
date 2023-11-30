import { FileTypes } from "./enums/file.enum";

export interface IMeta {
  src: string;
}

export interface IUploadedFile {
  type: FileTypes;
  meta: IMeta;
}
