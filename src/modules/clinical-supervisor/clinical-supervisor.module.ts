import { Module } from '@nestjs/common';

import { DepartmentModule } from 'department/department.module';
import { HospitalModule } from 'hospital/hospital.module';
import { UserModule } from 'user/user.module';

import { SupervisorController } from './clinical-supervisor.controller';
import { SupervisorService } from './clinical-supervisor.service';

@Module({
  imports: [UserModule, HospitalModule, DepartmentModule],
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class SupervisorModule {}
