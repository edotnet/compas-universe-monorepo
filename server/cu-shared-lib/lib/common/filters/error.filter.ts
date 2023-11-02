import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";
import { QueryFailedError } from "typeorm";
import { CustomLoggerService } from "../custom-logger/custom-logger.service";
import * as util from "util";

const serializeMessage = (error) => {
  if (["development", "local"].every((q) => q !== process.env.NODE_ENV)) {
    delete error.service;
  }

  return error;
};

@Injectable()
@Catch(RpcException)
export class RpcErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    this.logger.error("RpcErrorFilter: " + exception);
    const err = exception.getError() as any;
    if (!err.service) {
      err.service = process.env.SERVICE_NAME;
    }
    return throwError(serializeMessage(err));
  }
}

@Injectable()
@Catch(QueryFailedError)
export class QueryErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    this.logger.error("QueryErrorFilter: " + exception);
    if (exception.code == 23505) {
      return throwError(
        serializeMessage({
          service: process.env.SERVICE_NAME,
          message: exception.detail,
          statusCode: HttpStatus.CONFLICT,
        })
      );
    }
    exception.service = process.env.SERVICE_NAME;
    return throwError(serializeMessage(exception));
  }
}

@Injectable()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    this.logger.error("ErrorFilter: " + util.inspect(exception));
    if (exception.error) {
      if (exception.error.statusCode) {
        return throwError(
          serializeMessage({
            service: process.env.SERVICE_NAME,
            message: exception.error.message,
            statusCode: exception.error.statusCode,
          })
        );
      }
    }
    if (exception.code == 23505) {
      return throwError(
        serializeMessage({
          service: process.env.SERVICE_NAME,
          message: exception.detail,
          statusCode: HttpStatus.CONFLICT,
        })
      );
    }
    return throwError(
      serializeMessage({
        service: process.env.SERVICE_NAME,
        message: exception.message,
        statusCode: HttpStatus.BAD_REQUEST,
      })
    );
  }
}

@Injectable()
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error("HttpErrorFilter: " + exception);
    const ctx = host.switchToHttp();
    let status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let service = null;
    //rpc from another microservices
    if (exception.statusCode) {
      status = exception.statusCode;
      service = exception.service;
      return throwError(
        serializeMessage({
          service: exception.service,
          message: exception.message,
          statusCode: exception.statusCode,
        })
      );
    } else {
      return throwError(
        serializeMessage({
          service: process.env.SERVICE_NAME,
          message: "unexpected type of error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
}
