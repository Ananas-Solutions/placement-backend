import { Module } from '@nestjs/common';

import { UserModule } from 'user/user.module';

import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  imports: [UserModule],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
