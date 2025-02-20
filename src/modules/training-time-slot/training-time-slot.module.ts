import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseTrainingSiteEntity,
  TrainingTimeSlotEntity,
} from 'entities/index.entity';
import { PlacementModule } from 'placement/placement.module';
import { UserModule } from 'user/user.module';

import { TrainingSiteTimeSlotController } from './training-time-slot.controller';
import { TrainingSiteTimeSlotService } from './training-time-slot.service';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';
import { CourseGridViewEntity } from 'entities/course-grid-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingTimeSlotEntity,
      BlockTrainingTimeSlotEntity,
      CourseGridViewEntity,
      CourseTrainingSiteEntity,
    ]),
    UserModule,
    PlacementModule,
  ],
  controllers: [TrainingSiteTimeSlotController],
  providers: [TrainingSiteTimeSlotService],
  exports: [TrainingSiteTimeSlotService],
})
export class TrainingSiteTimeSlotModule {}
