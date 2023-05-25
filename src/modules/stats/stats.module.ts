import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { UserModule } from 'user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from 'entities/hospital.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { UserEntity } from 'entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalEntity,
      DepartmentUnitEntity,
      DepartmentEntity,
      UserEntity,
    ]),
    UserModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
