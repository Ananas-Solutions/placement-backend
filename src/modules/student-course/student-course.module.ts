import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserModule } from 'user/user.module';

import { StudentCourseService } from './student-course.service';
import { StudentCourseController } from './student-course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentCourseEntity]), UserModule],
  providers: [StudentCourseService],
  controllers: [StudentCourseController],
  exports: [StudentCourseService],
})
export class StudentCourseModule {}
