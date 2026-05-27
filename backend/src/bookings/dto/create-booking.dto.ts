import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createBookingSchema = z.object({
   deskId: z.string().uuid({ message: 'Некорректный формат ID стола' }),
  startTime: z.string().datetime({ offset: true, message: 'Невалидный формат ISO даты начала' }),
  endTime: z.string().datetime({ offset: true, message: 'Невалидный формат ISO даты окончания' }),
  guestName: z.string().min(1),
  guestPhone: z.string().min(1),
}).refine((data) => {
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();
  return end > start;
}, {
  message: 'Время окончания бронирования должно быть позже времени начала',
  path: ['endTime'],
});

export class CreateBookingDto extends createZodDto(createBookingSchema) {}