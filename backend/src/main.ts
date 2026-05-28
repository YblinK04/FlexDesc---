import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const IS_VERCEL = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined;

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ZodValidationPipe());
    
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      optionsSuccessStatus: 204,
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

if (!IS_VERCEL) {
  const logger = new Logger('Bootstrap');
  void bootstrap().then(async (app) => {
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen(port);
    logger.log(`🚀 FlexDesk Бэкенд локально запущен на http://localhost:${port}`);
  });
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const expressInstance = app.getHttpAdapter().getInstance();
  return expressInstance(req, res);
}