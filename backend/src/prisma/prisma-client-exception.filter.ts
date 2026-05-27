import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('PrismaExceptionFilter');

  override catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    this.logger.error(`Prisma Error [${exception.code}]: ${exception.message}`);

    switch (exception.code) {
      case 'P2002': {
        const target = (exception.meta?.target as string[])?.join(', ') || 'ресурс';
        return this.sendErrorResponse(response, HttpStatus.CONFLICT, {
          message: `Конфликт данных: ${target} уже используется или заблокирован.`,
          error: 'Conflict',
        });
      }

      case 'P2025': {
        return this.sendErrorResponse(response, HttpStatus.NOT_FOUND, {
          message: 'Запрашиваемый ресурс (рабочий стол или бронирование) не найден.',
          error: 'Not Found',
        });
      }

      
      case 'P2034': {
        return this.sendErrorResponse(response, HttpStatus.CONFLICT, {
          message: 'Запрос на бронирование пересекся с другим параллельным процессом. Пожалуйста, повторите попытку.',
          error: 'Transaction Conflict',
        });
      }

      default:
        super.catch(exception, host);
        return;
    }
  }

  private sendErrorResponse(
    response: Response, 
    status: HttpStatus, 
    payload: { message: string; error: string }
  ) {
    return response.status(status).json({
      statusCode: status,
      ...payload,
    });
  }
}