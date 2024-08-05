import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseTrainingSiteEntity,
  PlacementEntity,
  TrainingTimeSlotEntity,
} from 'entities/index.entity';
import { StudentCourseModule } from 'student-course/student-course.module';
import { UserModule } from 'user/user.module';

import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { CourseBlockEntity } from 'entities/course-block.entity';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlacementEntity,
      CourseTrainingSiteEntity,
      CourseBlockTrainingSiteEntity,
      CourseBlockEntity,
      TrainingTimeSlotEntity,
      BlockTrainingTimeSlotEntity,
    ]),
    UserModule,
    StudentCourseModule,
  ],
  controllers: [PlacementController],
  providers: [PlacementService],
  exports: [PlacementService],
})
export class PlacementModule {}
