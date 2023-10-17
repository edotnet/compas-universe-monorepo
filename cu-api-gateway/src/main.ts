import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as requestIp from 'request-ip';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';

async function bootstrap() {
  const expressApp = express();

  expressApp.get('/health', (req, res) => res.json({ success: 'ok' }));

  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  };

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {httpsOptions}
  );
  app.useLogger(app.get(Logger));

  const cors = {
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(cors);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );
  app.use(requestIp.mw());

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Compas Universe')
      .setDescription('')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(parseInt(process.env.PORT));
}

bootstrap();
