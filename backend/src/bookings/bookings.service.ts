import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    const startIso = new Date(dto.startTime);
    const endIso = new Date(dto.endTime);

    return this.prisma.$transaction(async (tx) => {
      const deskIdStr = String(dto.deskId);

      const desk = await tx.desk.findUnique({
        where: { id: deskIdStr },
      });
      
      if (!desk) {
        throw new NotFoundException('Запрашиваемый рабочий стол не найден');
      }

      const overlap = await tx.booking.findFirst({
        where: {
          deskId: deskIdStr,
          AND: [
            { startTime: { lt: endIso } },
            { endTime: { gt: startIso } },
          ],
        },
      });

      if (overlap) {
        throw new ConflictException('Выбранный временной слот уже занят другим гостем');
      }

      return tx.booking.create({
        data: {
          deskId: deskIdStr,
          startTime: startIso,
          endTime: endIso,
          guestName: dto.guestName,
          guestPhone: dto.guestPhone,
        },
      });
    }, {
      isolationLevel: 'Serializable',
    });
  }

  async findBookingsForDay(deskId: string, day: string) {
    if (!deskId || deskId === 'undefined' || !day || day === 'undefined') {
      return [];
    }

    const startOfDay = new Date(`${day}T00:00:00`);
    const endOfDay = new Date(`${day}T23:59:59`);

    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
      return [];
    }

    return this.prisma.extended.booking.findMany({
      where: {
        deskId: String(deskId),
        startTime: { gte: startOfDay },
        endTime: { lte: endOfDay },
      },
      orderBy: { startTime: 'asc' },
    });
  }
}