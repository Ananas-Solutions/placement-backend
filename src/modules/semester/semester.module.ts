import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SemesterEntity } from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  imports: [TypeOrmModule.forFeature([SemesterEntity]), UserModule],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
