import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { UsersModule } from './api/users/users.module';
import { LoggerModule } from 'nestjs-pino';
import jwt_decode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { AsyncContext, AsyncHooksModule } from '@nestjs-steroids/async-context';
import * as util from 'util';
import { controllers } from './api/controllers';
import { AuthModule } from './api/auth/auth.module';
import { ServicesModule } from '@edotnet/shared-lib';

export function sanitizeRequest(o) {
  const obj = { ...o };
  try {
    for (let k in obj) {
      if (k === 'parent') {
        continue;
      }
      if (k === 'file') {
        obj[k] = null;
      } else if (typeof obj[k] == 'object' && obj[k] !== null) {
        if (typeof obj[k] === 'string' || obj[k] instanceof String) {
          if (k.toLowerCase().includes('password')) {
            obj[k] = 'SANITIZED_PASSWORD';
          }
        } else {
          obj[k] = this.sanitizeRequest(obj[k]);
        }
      } else {
        if (typeof obj[k] === 'string' || obj[k] instanceof String) {
          if (k.toLowerCase().includes('password')) {
            obj[k] = 'SANITIZED_PASSWORD';
          }
        }
      }
    }
  } catch (e) {}
  return obj;
}

const sanitizeHeaders = (headers) => {
  const sanitizedHeaders = { ...headers };
  delete sanitizedHeaders.authorization;
  return sanitizedHeaders;
};

export const getUserIdFromAuthHeader = (headers) => {
  if (!headers.authorization) {
    return null;
  }
  let jwt = headers.authorization;
  jwt = jwt.replace('Bearer ', '');
  jwt = jwt.trim();
  if (jwt.length < 1) {
    return null;
  }
  const jwtDecode = jwt_decode(jwt);
  return jwtDecode['id'];
};

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'API',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        genReqId: (request) => {
          let asyncHook: AsyncContext = AsyncContext.getInstance();
          let id = uuidv4();
          asyncHook.register();
          asyncHook.set('reqId', id);
          return id;
        },
        messageKey: 'msg_api_result',
        customProps: (req: any, res) => {
          let userId = getUserIdFromAuthHeader(req.headers) || '';
          let ip = req.headers['x-forwarded-for'];
          if (req.headers && req.headers.authorization) {
            let jwt = req.headers.authorization;
            jwt = jwt.replace('Bearer ', '');
            const jwtDecode = jwt_decode(jwt);
            userId = jwtDecode['id'];
          }
          return {
            reqId: req.id,
            reqUserId: userId,
            msg: util.inspect(
              {
                url: req.url,
                method: req.method,
                headers: sanitizeHeaders(req.headers),
                body: sanitizeRequest(req.body),
                query: sanitizeRequest(req.query),
                ip,
                reqUserId: userId,
                reqId: req.id,
              },
              false,
              3,
            ),
          };
        },
        serializers: {
          req(req) {
            return null;
          },
          res(res) {
            return null;
          },
        },
        prettyPrint:
          process.env.NODE_ENV === 'development'
            ? {
                colorize: true,
                levelFirst: true,
                translateTime: true,
              }
            : false,
      },
      forRoutes: controllers,
      exclude: [],
    }),
    AuthModule,
    UsersModule,
    AsyncHooksModule,
    // ServicesModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PREFIX,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
