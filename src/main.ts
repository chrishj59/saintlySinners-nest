import {
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { auth } = require('express-oauth2-jwt-bearer');
  app.setGlobalPrefix('api/v1');
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true, // allow conversion underneath
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  app.useGlobalFilters();
  const jwtCheck = auth({
    audience: 'http://localhost:3010/saintlySinners',
    issuerBaseURL: 'https://dev-2vubuto6.eu.auth0.com/',
    tokenSigningAlg: 'RS256',
  });

  const corsOptions = {
    origin: configService.get<string>('CLIENT_ORIGIN_URL'),
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
    // optionsSuccessStatus: 200,
    // credentials: true,
  };
  app.enableCors(corsOptions);

  app.enableCors();
  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  const port = configService.get('PORT');
  console.log(`listen on port ${port}`);
  await app.listen(port);
}
bootstrap();
