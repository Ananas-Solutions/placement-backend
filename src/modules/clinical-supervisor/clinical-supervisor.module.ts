import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentModule } from 'department/department.module';
import {
  SupervisorDepartmentUnitEntity,
  SupervisorProfileEntity,
  TrainingTimeSlotEntity,
} from 'entities/index.entity';
import { HospitalModule } from 'hospital/hospital.module';
import { UserModule } from 'user/user.module';

import { SupervisorController } from './clinical-supervisor.controller';
import { SupervisorService } from './clinical-supervisor.service';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupervisorProfileEntity,
      SupervisorDepartmentUnitEntity,
      TrainingTimeSlotEntity,
      BlockTrainingTimeSlotEntity,
    ]),
    UserModule,
    HospitalModule,
    DepartmentModule,
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
