import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import {
  BlockTrainingSiteTimeSlotDto,
  TrainingSiteTimeSlotDto,
  UpdateBlockTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';

@ApiTags('training site time slots')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site-time-slot')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
export class TrainingSiteTimeSlotController {
  constructor(private readonly timeslotService: TrainingSiteTimeSlotService) {}

  @Post()
  async saveTimeSlots(@Body() body: TrainingSiteTimeSlotDto) {
    return await this.timeslotService.save(body);
  }

  @Post('block')
  async saveBlockTimeSlots(@Body() body: BlockTrainingSiteTimeSlotDto) {
    return await this.timeslotService.saveBlockTimeSlots(body);
  }

  @Get('training-site/:trainingsiteId')
  async findTrainingSiteTimeSlots(
    @Param('trainingsiteId') trainingsiteId: string,
  ) {
    return await this.timeslotService.findTimeSlots(trainingsiteId);
  }

  @Get('block-training-site/:blockTrainingSiteId')
  async findBlockTrainingSiteTimeSlots(
    @Param('blockTrainingSiteId') blockTrainingSiteId: string,
  ) {
    return await this.timeslotService.findBlockTimeSlots(blockTrainingSiteId);
  }

  @Get('block/:id')
  async findBlockTrainingSiteTimeSlot(@Param('id') timeslotId: string) {
    return await this.timeslotService.findBlockTimeSlot(timeslotId);
  }

  @Get(':id')
  async findTrainingSiteTimeSlot(@Param('id') timeslotId: string) {
    return await this.timeslotService.findTimeSlot(timeslotId);
  }

  @Put('block/:id')
  async updateBlockTrainingSiteTimeSlot(
    @Param('id') id: string,
    @Body() body: UpdateBlockTimeSlotDto,
  ) {
    return await this.timeslotService.updateBlockTimeSlot(id, body);
  }

  @Put(':id')
  async updateTrainingSiteTimeSlot(
    @Param('id') id: string,
    @Body() body: UpdateTimeSlotDto,
  ) {
    return await this.timeslotService.updateTimeSlot(id, body);
  }

  @Delete('block/:id')
  async deleteBlockTrainingSiteTimeSlot(@Param('id') id: string) {
    return this.timeslotService.deleteBlockTimeSlot(id);
  }

  @Delete(':id')
  async deleteTrainingSiteTimeSlot(@Param('id') id: string) {
    return this.timeslotService.deleteTimeSlot(id);
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
