import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollegeDepartmentEntity } from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { CollegeDepartmentController } from './college-department.controller';
import { CollegeDepartmentService } from './college-department.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollegeDepartmentEntity]), UserModule],
  controllers: [CollegeDepartmentController],
  providers: [CollegeDepartmentService],
  exports: [CollegeDepartmentService],
})
export class CollegeDepartmentModule {}
