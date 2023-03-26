import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoordinatorCollegeDepartmentEntity } from 'entities/coordinator-college-department.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { UserModule } from 'user/user.module';

import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartmentEntity,
      CoordinatorCollegeDepartmentEntity,
    ]),
    UserModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
