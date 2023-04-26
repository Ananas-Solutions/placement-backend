import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseEntity,
  CourseTrainingSiteEntity,
  StudentCourseEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';
import { TrainingSiteTimeSlotModule } from 'training-time-slot/training-time-slot.module';
import { PlacementModule } from 'placement/placement.module';

import { CourseController } from './course.controller';
import { CourseService } from './services/course.service';
import { CourseTrainingSiteService } from './services/course-training-site.service';
import { CourseExportService } from './services/course-export.service';
import { CourseTransferService } from './services/course-transfer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseTrainingSiteEntity,
      StudentCourseEntity,
    ]),
    UserModule,
    TrainingSiteTimeSlotModule,
    PlacementModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    CourseTrainingSiteService,
    CourseExportService,
    CourseTransferService,
  ],
  exports: [CourseService, CourseTrainingSiteService],
})
export class CourseModule {}
