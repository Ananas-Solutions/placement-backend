import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HospitalEntity } from 'entities/index.entity';
import { UserModule } from 'user/user.module';

import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalEntity]), UserModule],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService],
})
export class HospitalModule {}
