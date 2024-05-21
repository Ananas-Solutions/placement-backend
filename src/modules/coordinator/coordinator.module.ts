import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CoordinatorCollegeDepartmentEntity,
  CoordinatorProfileEntity,
  CourseEntity,
} from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { CoordinatorController } from './coordinator.controller';
import { CoordinatorService } from './coordinator.service';

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
  exports: [CoordinatorService],
})
export class CoordinatorModule {}
