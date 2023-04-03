import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CourseEntity,
  CourseTrainingSiteEntity,
  StudentCourseEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';

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
