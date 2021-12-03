import { Module } from '@nestjs/common';
import { StudentCourseService } from './student-course.service';
import { StudentCourseController } from './student-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourse } from './entity/student-course.entity';
import { UserModule } from 'src/user/user.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCourse]),
    UserModule,
    CoursesModule,
  ],
  providers: [StudentCourseService],
  controllers: [StudentCourseController],
  exports: [StudentCourseService],
})
export class StudentCourseModule {}
