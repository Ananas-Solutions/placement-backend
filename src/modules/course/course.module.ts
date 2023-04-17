import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseEntity,
  CourseTrainingSiteEntity,
  StudentCourseEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { CourseController } from './course.controller';
import { CourseService } from './services/course.service';
import { CourseTrainingSiteService } from './services/course-training-site.service';
import { TrainingSiteTimeSlotModule } from 'training-time-slot/training-time-slot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseTrainingSiteEntity,
      StudentCourseEntity,
    ]),
    UserModule,
    TrainingSiteTimeSlotModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseTrainingSiteService],
  exports: [CourseService, CourseTrainingSiteService],
})
export class CourseModule {}
