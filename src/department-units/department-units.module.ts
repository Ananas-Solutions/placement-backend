import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from 'src/department/department.module';
import { DepartmentUnitsController } from './department-units.controller';
import { DepartmentUnitsService } from './department-units.service';
import { DepartmentUnits } from './entity/department-units.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentUnits]), DepartmentModule],
  controllers: [DepartmentUnitsController],
  providers: [DepartmentUnitsService],
})
export class DepartmentUnitsModule {}
