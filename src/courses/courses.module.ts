import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseTrainingSite } from './entity/course-training-site.entity';
import { Courses } from './entity/courses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courses, CourseTrainingSite]),
    UserModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
