import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ComposeAuthorizedDto,
  FILE_UPLOAD,
  MediaData,
  MediaTypes,
  TransactionsServiceName,
  User,
} from '@edotnet/shared-lib';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserGuard } from '../auth/guards/user.guard';
import { Files } from 'src/common/decorators/file.decorator';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(
    @Inject(TransactionsServiceName)
    private readonly client: ClientProxy,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFile(
    @UserGuard() user: User,
    @Files() files: Express.Multer.File[],
    @Body('type') type: MediaTypes,
  ): Promise<MediaData[]> {
    return this.client
      .send(FILE_UPLOAD, ComposeAuthorizedDto(user, { type, files }))
      .toPromise();
  }
}
