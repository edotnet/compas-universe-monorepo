import { Injectable } from '@nestjs/common';
import {
  AWSStorageService,
  MediaData,
  UploadFileRequest,
} from '@edotnet/shared-lib';

@Injectable()
export class StorageService {
  constructor(private readonly awsStorageService: AWSStorageService) {}

  async uploadFile(dto: UploadFileRequest): Promise<MediaData[]> {
    const media: MediaData[] = await Promise.all(
      dto.files.map(async (file) => {
        const { buffer, originalname } = file;

        const src = await this.awsStorageService.uploadToS3Async(
          Buffer.from(buffer.data),
          originalname.replace(/ /g, '_'),
        );

        return {
          type: dto.type,
          meta: { src },
        };
      }),
    );

    return media;
  }
}
