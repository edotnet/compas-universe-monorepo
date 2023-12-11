import {
  FileTypeValidator,
  MAX_FILE_SIZE_IN_BYTES,
  VALID_IMAGE_UPLOADS_MIME_TYPES,
  VALID_VIDEO_UPLOADS_MIME_TYPES,
} from '@edotnet/shared-lib';
import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const Files = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const files = request.files as Express.Multer.File[];

  const isImage = files.some((file) => file.mimetype.startsWith('image/'));
  const isVideo = files.some((file) => file.mimetype.startsWith('video/'));

  let fileTypeValidators: FileTypeValidator;

  if (isImage) {
    fileTypeValidators = new FileTypeValidator({
      fileType: VALID_IMAGE_UPLOADS_MIME_TYPES,
    });
  }

  if (isVideo) {
    fileTypeValidators = new FileTypeValidator({
      fileType: VALID_VIDEO_UPLOADS_MIME_TYPES,
    });
  }

  if (isImage && isVideo) {
    throw new RpcException({
      httpStatus: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message: 'UPLOAD_EITHER_VIDEOS_OR_IMAGES',
    });
  }

  if (!fileTypeValidators) {
    throw new RpcException({
      httpStatus: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message: 'AT_LEAST_ONE_FILE_TYPE_SHOULD_BE_SPECIFIED',
    });
  }

  const parseFilePipe = new ParseFilePipeBuilder()
    .addValidator(fileTypeValidators)
    .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE_IN_BYTES })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY });

  return parseFilePipe.transform(files);
});
