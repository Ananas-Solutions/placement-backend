import { Module } from '@nestjs/common';

import { PlacementModule } from 'placement/placement.module';
import { UserModule } from 'user/user.module';

import { TrainingSiteTimeSlotController } from './training-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';

@Module({
  imports: [UserModule, PlacementModule],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
  exports: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
