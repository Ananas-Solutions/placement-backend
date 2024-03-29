import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingTimeSlotEntity } from 'entities/index.entity';
import { PlacementModule } from 'placement/placement.module';
import { UserModule } from 'user/user.module';

import { TrainingSiteTimeSlotController } from './training-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingTimeSlotEntity,
      BlockTrainingTimeSlotEntity,
    ]),
    UserModule,
    PlacementModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
  exports: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
