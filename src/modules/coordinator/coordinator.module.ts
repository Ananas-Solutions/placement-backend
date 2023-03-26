import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';

import { CourseEntity } from 'entities/courses.entity';
import { UserModule } from 'user/user.module';
import { CoordinatorProfileEntity } from 'entities/coordinator-profile.entity';
import { CoordinatorCollegeDepartmentEntity } from 'entities/coordinator-college-department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoordinatorProfileEntity,
      CourseEntity,
      CoordinatorCollegeDepartmentEntity,
    ]),
    UserModule,
  ],
  controllers: [CoordinatorController],
  providers: [CoordinatorService],
})
export class CoordinatorModule {}
