import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Logger } from 'nestjs-pino';
import { SERVICE_NAME } from './common/constants/constants';

async function bootstrap() {
  process.env['SERVICE_NAME'] = SERVICE_NAME;

  const expressApp = express();
  expressApp.get('/health', (req, res) => res.json({ success: 'ok' }));
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useLogger(app.get(Logger));
  const microservice = app.connectMicroservice(
    {
      logger: process.env.DEBUG
        ? ['error', 'warn', 'log', 'debug']
        : ['error', 'warn'],
      transport: Transport.RMQ,
      options: {
        urls: [
          `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
        ],
        queue: SERVICE_NAME,
        queueOptions: {
          durable: true,
        },
      },
    },
    { inheritAppConfig: true },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.startAllMicroservices();
  app.listen(process.env.PORT, () => console.log('Microservice is listening'));
}

bootstrap();
