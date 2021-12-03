import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityModule } from 'src/authority/authority.module';
import { Hospital } from './entity/hospital.entity';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital]), AuthorityModule],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService],
})
export class HospitalModule {}
