import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';


@Controller('bookings') 
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

 
  @Get()
  async findForDay(
    @Query('deskId') deskId: string,
    @Query('day') day: string,
  ) {
    return this.bookingsService.findBookingsForDay(deskId, day);
  }
}