import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AsyncContext } from '@nestjs-steroids/async-context';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';
import { map } from 'rxjs/operators';

@Injectable()
export class MapInterceptor implements NestInterceptor {

    constructor(private readonly asyncHook: AsyncContext,
                private readonly logger: CustomLoggerService) {
    }


    intercept(context: ExecutionContext, next: CallHandler) {

        const c = context.switchToHttp();
        const data = c.getRequest();
        if (!data) {
            this.logger.info('data is undefined in request');
            return next.handle();
        }
        return next.handle().pipe(
          map(data => {
              data = this.checkMaps(data);
              return data;
          }),
        );
    }

    checkMaps(obj) {
        const mapToObj = m => {
            return Array.from(m).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
        };
        if (obj instanceof Map) {
            return mapToObj(obj);
        }
        for (let k in obj) {
            if (k === 'parent') {
                continue;
            }
            if (typeof obj[k] == 'object' && obj[k] !== null) {
                if (obj[k] instanceof Map) {
                    obj[k] = mapToObj(obj[k]);
                } else {
                    obj[k] = this.checkMaps(obj[k]);
                }
            } else {
                if (obj[k] instanceof Map) {
                    obj[k] = mapToObj(obj[k]);
                }
            }
        }
        return obj;
    }
}
