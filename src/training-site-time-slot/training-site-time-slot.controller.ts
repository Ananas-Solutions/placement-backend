import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { TrainingSiteTimeSlotDto } from './dto/training-site-time-slot.dto';
import { TrainingSiteTimeSlotService } from './training-site-time-slot.service';

@ApiTags('training site time slots')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site-time-slot')
export class TrainingSiteTimeSlotController {
  constructor(private readonly timeslotService: TrainingSiteTimeSlotService) {}

  @Post()
  async saveTimeSlots(@Body() body: TrainingSiteTimeSlotDto): Promise<any> {
    return await this.timeslotService.save(body);
  }

  @Get('training-site/:trainingSiteId')
  async findTrainingSiteTimeSlots(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.timeslotService.findTimeSlots(trainingSiteId);
  }
}
