import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { CreateCourseEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@ApiTags('events')
@UseInterceptors(ErrorInterceptor)
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Post('course')
  async createEvent(@Body() body: CreateCourseEventDto) {
    return this.eventsService.createEvent(body);
  }

  @Get('course/:courseId')
  async getAllEvents(@Param('courseId') courseId: string) {
    return this.eventsService.getAllCourseEvents(courseId);
  }
}
