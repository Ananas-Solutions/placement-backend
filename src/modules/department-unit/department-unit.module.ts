import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentUnitEntity } from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { DepartmentUnitsController } from './department-unit.controller';
import { DepartmentUnitsService } from './department-unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentUnitEntity]), UserModule],
  controllers: [DepartmentUnitsController],
  providers: [DepartmentUnitsService],
})
export class DepartmentUnitsModule {}
