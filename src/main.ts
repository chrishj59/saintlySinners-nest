import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'aws-sdk';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true, // allow conversion underneath
      },
    }),
  );
  app.use(cookieParser());

  //app.use(csurf())
  const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(corsOptions);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });
  await app.listen(port);
}
bootstrap();
