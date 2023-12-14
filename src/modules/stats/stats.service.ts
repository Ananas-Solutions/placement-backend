import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import {
  CoursesRepositoryService,
  DepartmentRepositoryService,
  DepartmentUnitsRepositoryService,
  HospitalRepositoryService,
  StudentCourseRepositoryService,
  UserRepositoryService,
} from 'repository/services';

@Injectable()
export class StatsService {
  constructor(
    private readonly hospitalRepository: HospitalRepositoryService,
    private readonly userEntity: UserRepositoryService,
    private readonly departmentEntity: DepartmentRepositoryService,
    private readonly departmentUnitEntity: DepartmentUnitsRepositoryService,
    private readonly courseEntity: CoursesRepositoryService,
    private readonly studentCourseRepository: StudentCourseRepositoryService,
  ) {}

  public async getStatsForAdmin() {
    const totalClinicalCoordinators = await this.userEntity.count({
      role: UserRoleEnum.CLINICAL_COORDINATOR,
    });

    const totalSupervisors = await this.userEntity.count({
      role: UserRoleEnum.CLINICAL_SUPERVISOR,
    });

    const totalStudents = await this.userEntity.count({
      role: UserRoleEnum.STUDENT,
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

  public async getStatsForCoordinator(coordinatorId: string) {
    const allCourses = await this.courseEntity.findMany({
      coordinator: { id: coordinatorId },
    });

    const allCoursesIds = allCourses.map((c) => c.id);

    const totalStudents = await this.studentCourseRepository.count({
      course: {
        id: In(allCoursesIds),
      },
    });

    return {
      totalCourses: allCourses.length,
      totalStudents: totalStudents,
    };
  }
}
