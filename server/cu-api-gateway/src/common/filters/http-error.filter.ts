import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import * as util from 'util';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

    constructor(private readonly logger: PinoLogger) {
    }

    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        let service = 'api-gateway';
        //rpc
        if (exception.error && exception.error.statusCode) {
            status = exception.error.statusCode;
        }

        if (exception.statusCode) {
            status = exception.statusCode;
            service = exception.service;
        }
        //auth
        if (exception.name === 'InternalOAuthError') {
            status = exception.oauthError.statusCode;
            exception.message = exception.oauthError.data;
        }
        let message = exception.message;
        //validations
        if (exception.response) {
            message = exception.response.message;
        }
        const errorResponse = {
            code: status,
            timestamp: new Date().toTimeString(),
            path: request.url,
            method: request.method,
            message: message,
            service: service,
        };
        if (errorResponse && errorResponse.code === HttpStatus.INTERNAL_SERVER_ERROR &&
          process.env.HIDE_ERROR_MESSAGES === 'true' && !request.url.includes('capiteus')) {
            errorResponse.message = 'internal server error';
        }
        typeof exception === 'object'
          ? this.logger.error(`${request.method} ${request.url} ${util.inspect(errorResponse, false, 3)}`)
          : this.logger.error(`${request.method} ${request.url} ${exception}`);

        response.status(status).json(errorResponse);
    }
}
