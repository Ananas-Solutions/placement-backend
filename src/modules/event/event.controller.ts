import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { CreateCourseEventDto } from './dto/create-course-event.dto';
import { EventService } from './event.service';
import { CreateEventDto } from './dto';

@ApiTags('events')
@UseInterceptors(ErrorInterceptor)
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN)
  async createEvent(@Body() body: CreateEventDto) {
    return this.eventsService.createEvent(body);
  }

  @Post('course')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async createCourseEvent(@Body() body: CreateCourseEventDto) {
    return this.eventsService.createCourseEvent(body);
  }

  @Get()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.STUDENT)
  async getAllEvents(@Req() req) {
    return this.eventsService.getAllEvents(req.user.id);
  }

  @Get('course/:courseId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async getAllCourseEvents(@Param('courseId') courseId: string) {
    return this.eventsService.getAllCourseEvents(courseId);
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
