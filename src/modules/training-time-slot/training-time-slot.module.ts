import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';
import { PlacementModule } from 'placement/placement.module';
import { UserModule } from 'user/user.module';

import { TrainingSiteTimeSlotController } from './training-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingTimeSlotEntity]),
    UserModule,
    PlacementModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
