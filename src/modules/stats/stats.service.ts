import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'commons/enums';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { HospitalEntity } from 'entities/hospital.entity';
import { UserEntity } from 'entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentEntity: Repository<DepartmentEntity>,
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitEntity: Repository<DepartmentUnitEntity>,
  ) {}

  async getStatsForAdmin() {
    const totalClinicalCoordinators = await this.userEntity.count({
      where: { role: UserRoleEnum.CLINICAL_COORDINATOR },
    });

    const totalSupervisors = await this.userEntity.count({
      where: { role: UserRoleEnum.CLINICAL_SUPERVISOR },
    });

    const totalStudents = await this.userEntity.count({
      where: { role: UserRoleEnum.STUDENT },
    });

    const totalHospitals = await this.hospitalRepository.count();

    const totalDepartments = await this.departmentEntity.count();

    const totalDepartmentUnits = await this.departmentUnitEntity.count();

    return {
      totalClinicalCoordinators,
      totalSupervisors,
      totalStudents,
      totalHospitals,
      totalDepartments,
      totalDepartmentUnits,
    };
  }
}
