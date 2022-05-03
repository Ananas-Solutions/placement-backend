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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { TrainingSiteTimeSlotDto } from './dto/training-site-time-slot.dto';
import { TrainingSiteTimeSlotService } from './training-site-time-slot.service';

@ApiTags('training site time slots')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site-time-slot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingSiteTimeSlotController {
  constructor(private readonly timeslotService: TrainingSiteTimeSlotService) {}

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Post()
  async saveTimeSlots(@Body() body: TrainingSiteTimeSlotDto): Promise<any> {
    return await this.timeslotService.save(body);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('training-site/:trainingSiteId')
  async findTrainingSiteTimeSlots(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.timeslotService.findTimeSlots(trainingSiteId);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('training-site/:trainingSiteId/:trainingDays')
  async findTrainingSiteDaysTimeSlots(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.timeslotService.findTimeSlots(trainingSiteId);
  }
}
