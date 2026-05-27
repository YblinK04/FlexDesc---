import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DesksService {
  constructor(private readonly prisma: PrismaService) {}

  // Метод получения всех столов с безопасным вычислением текущей занятости
  async findAll() {
    // 🟩 ИСПРАВЛЕНИЕ: Создаем точный объект даты в UTC для синхронизации с базой Neon DB
    const now = new Date();

    return this.prisma.extended.desk.findMany({
      include: {
        bookings: {
          where: {
            // Стол занят, если текущий момент находится внутри интервала бронирования
            startTime: { lte: now },
            endTime: { gte: now },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const desk = await this.prisma.extended.desk.findUnique({
      where: { id: String(id) }, // Подстраховка приведения типов
    });
    if (!desk) {
      throw new NotFoundException('Запрашиваемый рабочий стол не найден');
    }
    return desk;
  }
}