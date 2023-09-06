import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'commons/enums';
import { CourseEntity } from 'entities/courses.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { HospitalEntity } from 'entities/hospital.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserEntity } from 'entities/user.entity';
import { In, Repository } from 'typeorm';

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
    @InjectRepository(CourseEntity)
    private readonly courseEntity: Repository<CourseEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
  ) {}

  public async getStatsForAdmin() {
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

  public async getStatsForCoordinator(coordinatorId: string) {
    const allCourses = await this.courseEntity.find({
      where: { coordinator: { id: coordinatorId } },
    });

    const allCoursesIds = allCourses.map((c) => c.id);

    const totalStudents = await this.studentCourseRepository.count({
      where: {
        course: {
          id: In(allCoursesIds),
        },
      },
    });

    return {
      totalCourses: allCourses.length,
      totalStudents: totalStudents,
    };
  }
}
