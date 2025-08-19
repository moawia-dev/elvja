import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { configurePassport } from './auth/strategies';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';

import { ValidationPipe } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prisma = app.get(PrismaService);
  const auth = app.get(AuthService);
  configurePassport(passport, prisma, auth);
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://elvja.vercel.app'   // replace after first deploy if you want
  ],
  credentials: true,
});

  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.PORT || 3000);
  // eslint-disable-next-line no-console
  console.log('Elvja backend up on', await app.getUrl());
}
bootstrap();
