import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseEntity,
  PlacementEntity,
  StudentCourseEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { StudentCourseService } from './student-course.service';
import { StudentCourseController } from './student-course.controller';
import { CourseBlockEntity } from 'entities/course-block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentCourseEntity,
      CourseEntity,
      CourseBlockEntity,
      PlacementEntity,
    ]),
    UserModule,
  ],
  providers: [StudentCourseService],
  controllers: [StudentCourseController],
  exports: [StudentCourseService],
})
export class StudentCourseModule {}
