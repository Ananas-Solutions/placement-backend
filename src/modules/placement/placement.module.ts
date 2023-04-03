import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseTrainingSiteEntity,
  PlacementEntity,
} from 'entities/index.entity';
import { StudentCourseModule } from 'student-course/student-course.module';
import { UserModule } from 'user/user.module';

import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlacementEntity, CourseTrainingSiteEntity]),
    UserModule,
    StudentCourseModule,
  ],
  controllers: [PlacementController],
  providers: [PlacementService],
  exports: [PlacementService],
})
export class PlacementModule {}
