import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Logger } from 'nestjs-pino';
import { WsServiceName, WsMicroservice } from '@edotnet/shared-lib';

async function bootstrap() {
  process.env['SERVICE_NAME'] = WsServiceName;

  const expressApp = express();
  expressApp.get('/health', (req, res) => res.json({ success: 'ok' }));
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useLogger(app.get(Logger));
  const microservice = app.connectMicroservice(WsMicroservice, {
    inheritAppConfig: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  
  await app.startAllMicroservices();
  app.listen(process.env.PORT, () => console.log('Microservice is listening'));
}

bootstrap();
