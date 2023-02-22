import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { ExecuteEventDto } from './dto/execute-event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() body: CreateEventDto) {
    return this.eventsService.createEvent(body);
  }

  @Post('execute')
  async executeEvent(@Body() body: ExecuteEventDto) {
    return this.eventsService.executeEvent(body);
  }

  @Get('course/:courseId')
  async getAllEvents(@Param('courseId') courseId: string) {
    return this.eventsService.getAllEvents(courseId);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.eventsService.findOneEvent(id);
  }

  @Put()
  async updateEvent(@Body() body: UpdateEventDto) {
    return this.eventsService.updateEvent(body);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
