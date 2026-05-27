import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { DesksService } from './desks.service';

@Controller('desks')
export class DesksController {
  constructor(private readonly desksService: DesksService) {}

  @Get()
  async findAll() {
    return this.desksService.findAll();
  }

  @Get(':deskId')
  async findOne(@Param('deskId', ParseUUIDPipe) deskId: string) {
    return this.desksService.findOne(deskId);
  }
}