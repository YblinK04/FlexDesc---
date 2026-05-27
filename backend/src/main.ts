import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
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
    
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}


export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}