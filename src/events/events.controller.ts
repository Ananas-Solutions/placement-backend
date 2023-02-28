import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@UseInterceptors(ErrorInterceptor)
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() body: CreateEventDto) {
    return this.eventsService.createEvent(body);
  }
}
