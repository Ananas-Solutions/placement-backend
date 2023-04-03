import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CoordinatorCollegeDepartmentEntity,
  DepartmentEntity,
} from 'entities/index.entity';
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
