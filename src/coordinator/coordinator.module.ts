import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeDepartmentModule } from 'src/college-department/college-department.module';
import { CoordinatorCourseModule } from 'src/coordinator-course/coordinator-course.module';
import { CoordinatorCourse } from 'src/coordinator-course/entity/coordinator-course.entity';
import { UserModule } from 'src/user/user.module';
import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';
import { CoordinatorProfile } from './entity/coordinator-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoordinatorProfile, CoordinatorCourse]),
    UserModule,
    CoordinatorCourseModule,
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
