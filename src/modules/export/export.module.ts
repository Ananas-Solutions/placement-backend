import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityEntity } from 'entities/authority.entity';
import { HospitalEntity } from 'entities/hospital.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthorityEntity,
      HospitalEntity,
      DepartmentEntity,
      DepartmentUnitEntity,
    ]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
