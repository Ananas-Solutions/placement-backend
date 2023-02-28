import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { StudentCourseModule } from 'src/student-course/student-course.module';
import { UserModule } from 'src/user/user.module';
import { Placement } from './entity/placement.entity';
import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Placement, CourseTrainingSite]),
    UserModule,
    StudentCourseModule,
  ],
  controllers: [PlacementController],
  providers: [PlacementService],
  exports: [PlacementService],
})
export class PlacementModule {}
