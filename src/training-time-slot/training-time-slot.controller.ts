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
import { TrainingSiteTimeSlotDto } from './dto/training-time-slot.dto';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';
import { TrainingDaysEnum } from './types/training-site-days.enum';

@ApiTags('training site time slots')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site-time-slot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingSiteTimeSlotController {
  constructor(private readonly timeslotService: TrainingSiteTimeSlotService) {}

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Post()
  async saveTimeSlots(@Body() body: TrainingSiteTimeSlotDto): Promise<any> {
    return await this.timeslotService.save(body);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('training-site/:trainingsiteId')
  async findTrainingSiteTimeSlots(
    @Param('trainingsiteId') trainingsiteId: string,
  ): Promise<any> {
    return await this.timeslotService.findTimeSlots(trainingsiteId);
  }

  @Roles(Role.ADMIN, Role.CLINICAL_COORDINATOR)
  @Get('training-site/:trainingSiteId/:trainingDay')
  async findTrainingSiteDaysTimeSlots(
    @Param('trainingSiteId') trainingSiteId: string,
    @Param('trainingDay') trainingDay: TrainingDaysEnum,
  ): Promise<any> {
    return await this.timeslotService.findDaysTimeSlots(
      trainingSiteId,
      trainingDay,
    );
  }
}
