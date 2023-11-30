import { Controller, Inject } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  FILE_UPLOAD,
  InjectAuth,
  MediaData,
  UploadFileRequest,
} from '@edotnet/shared-lib';

@Controller()
export class StorageController {
  constructor(@Inject(StorageService) private service: StorageService) {}

  @MessagePattern(FILE_UPLOAD)
  async uploadFile(
    dto: InjectAuth<UploadFileRequest>,
  ): Promise<MediaData[]> {
    return await this.service.uploadFile(dto);
  }
}
