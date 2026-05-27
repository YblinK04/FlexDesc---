import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

import ws from 'ws'; 

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        
        if (!dbUrl) {
          throw new Error('❌ Критическая ошибка: DATABASE_URL не найден в конфигурации .env!');
        }

        
        neonConfig.webSocketConstructor = ws;

        const adapter = new PrismaNeon({ connectionString: dbUrl });

        return new PrismaService({ adapter });
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}