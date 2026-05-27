import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../src/prisma/prisma-client-exception.filter';
import { PrismaService } from '../src/prisma/prisma.service'; 

describe('FlexDesk API (E2E Integration Tests)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    
    app.useGlobalPipes(new ZodValidationPipe());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.init();
  });

  afterAll(async () => {
    const prismaService = app.get(PrismaService);
    await prismaService.$disconnect(); 
    await app.close(); 
  });

  describe('GET /api/desks', () => {
    it('должен возвращать статус 200 и массив засидженных столов коворкинга', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/desks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('area');
        expect(response.body[0]).toHaveProperty('pricePerHourCents');
      }
    });
  });

  describe('POST /api/bookings - Валидация контракта данных', () => {
    it('должен отфутболивать запрос со статусом 400, если deskId не является UUID', async () => {
      const malformedPayload = {
        deskId: 'not-a-valid-uuid-string',
        startTime: '2026-05-27T14:00:00.000Z',
        endTime: '2026-05-27T16:00:00.000Z',
        guestName: 'Тест',
        guestPhone: '+7 (999) 999-99-99'
      };

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .send(malformedPayload)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Validation failed');
    });
  });
});