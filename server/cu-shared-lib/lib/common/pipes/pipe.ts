import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipeHybrid extends ValidationPipe {
    public async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'custom'){
            return value;
        }

        return plainToClass(metadata.metatype, value);
    }
}
