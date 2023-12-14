import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { CollegeDepartmentController } from './college-department.controller';
import { CollegeDepartmentService } from './college-department.service';

@Module({
  imports: [UserModule],
  controllers: [CollegeDepartmentController],
  providers: [CollegeDepartmentService],
  exports: [CollegeDepartmentService],
})
export class CollegeDepartmentModule {}
