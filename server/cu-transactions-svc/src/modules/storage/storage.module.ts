import { Module } from '@nestjs/common';
import { AWSStorageService } from '@edotnet/shared-lib';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: AWSStorageService,
      useFactory: () =>
        new AWSStorageService(
          process.env.AWS_ACCESS_KEY_ID,
          process.env.AWS_SECRET_ACCESS_KEY,
          process.env.AWS_HOST,
          process.env.AWS_SIGNATURE_VERSION,
          process.env.AWS_REGION,
          process.env.AWS_BUCKET,
        ),
    },
  ],
})
export class StorageModule {}