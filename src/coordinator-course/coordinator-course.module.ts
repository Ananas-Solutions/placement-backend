import { Module } from '@nestjs/common';
import { CoordinatorCourseService } from './coordinator-course.service';
import { CoordinatorCourseController } from './coordinator-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinatorCourse } from './entity/coordinator-course.entity';
import { UserModule } from 'src/user/user.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoordinatorCourse]),
    UserModule,
    CoursesModule,
  ],
  providers: [CoordinatorCourseService],
  controllers: [CoordinatorCourseController],
  exports: [CoordinatorCourseService],
})
export class CoordinatorCourseModule {}
