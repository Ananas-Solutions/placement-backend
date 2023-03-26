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

import { TrainingSiteTimeSlotDto } from './dto';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';

@ApiTags('training site time slots')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site-time-slot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingSiteTimeSlotController {
  constructor(private readonly timeslotService: TrainingSiteTimeSlotService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Post()
  async saveTimeSlots(@Body() body: TrainingSiteTimeSlotDto) {
    return await this.timeslotService.save(body);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('training-site/:trainingsiteId')
  async findTrainingSiteTimeSlots(
    @Param('trainingsiteId') trainingsiteId: string,
  ) {
    return await this.timeslotService.findTimeSlots(trainingsiteId);
  }

  // @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  // @Get('training-site/:trainingSiteId/:trainingDay')
  // async findTrainingSiteDaysTimeSlots(
  //   @Param('trainingSiteId') trainingSiteId: string,
  //   @Param('trainingDay') trainingDay: TrainingDaysEnum,
  // ) {
  //   return await this.timeslotService.findDaysTimeSlots(
  //     trainingSiteId,
  //     trainingDay,
  //   );
  // }
}
