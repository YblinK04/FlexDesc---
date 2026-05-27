import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PrismaService');
  
  
  public readonly extended: ReturnType<PrismaService['getExtendedClient']>;

  constructor(options: any) {
    super(options);
    
    this.extended = this.getExtendedClient();
  }

  private getExtendedClient() {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const before = Date.now();
            const result = await query(args);
            const executionTime = Date.now() - before;

            if (executionTime > 200) {
              new Logger('PrismaMetrics').warn(
                `⚠️ Медленный запрос: ${model}.${operation} занял ${executionTime}ms`,
              );
            }
            return result;
          },
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🟩 Успешное подключение к Neon DB через Serverless Driver Adapter');
    } catch (error) {
      this.logger.error('❌ Критическая ошибка подключения к Neon DB:', error);
      process.exit(1);
    }
  }
}