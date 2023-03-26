import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'user/user.module';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { CourseEntity } from 'entities/courses.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';

import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseTrainingSiteEntity,
      StudentCourseEntity,
    ]),
    UserModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
