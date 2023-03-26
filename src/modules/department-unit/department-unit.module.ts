import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'user/user.module';
import { DepartmentUnitEntity } from 'entities/department-units.entity';

import { DepartmentUnitsController } from './department-unit.controller';
import { DepartmentUnitsService } from './department-unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentUnitEntity]), UserModule],
  controllers: [DepartmentUnitsController],
  providers: [DepartmentUnitsService],
})
export class DepartmentUnitsModule {}
