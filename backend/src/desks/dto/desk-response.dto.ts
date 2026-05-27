import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const deskResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  area: z.string(),
  pricePerHourCents: z.number().int(),
});

export class DeskResponseDto extends createZodDto(deskResponseSchema) {}