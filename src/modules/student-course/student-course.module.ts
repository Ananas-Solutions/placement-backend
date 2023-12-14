import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { StudentCourseService } from './student-course.service';
import { StudentCourseController } from './student-course.controller';

@Module({
  imports: [UserModule],
  providers: [StudentCourseService],
  controllers: [StudentCourseController],
  exports: [StudentCourseService],
})
export class StudentCourseModule {}
