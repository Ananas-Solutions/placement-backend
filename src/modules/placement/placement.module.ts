import { Module } from '@nestjs/common';

import { StudentCourseModule } from 'student-course/student-course.module';
import { UserModule } from 'user/user.module';

import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';

@Module({
  imports: [UserModule, StudentCourseModule],
  controllers: [PlacementController],
  providers: [PlacementService],
  exports: [PlacementService],
})
export class PlacementModule {}
