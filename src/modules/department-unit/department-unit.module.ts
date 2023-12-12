import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { DepartmentUnitsController } from './department-unit.controller';
import { DepartmentUnitsService } from './department-unit.service';

@Module({
  imports: [UserModule],
  controllers: [DepartmentUnitsController],
  providers: [DepartmentUnitsService],
})
export class DepartmentUnitsModule {}
