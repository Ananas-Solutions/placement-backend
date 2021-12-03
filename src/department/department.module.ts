import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalModule } from 'src/hospital/hospital.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department } from './entity/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department]), HospitalModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
