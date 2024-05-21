import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { AuthorityEntity } from 'entities/authority.entity';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';
import { CourseEntity } from 'entities/courses.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { HospitalEntity } from 'entities/hospital.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserEntity } from 'entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private readonly authorityRepository: Repository<AuthorityEntity>,
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentEntity: Repository<DepartmentEntity>,
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitEntity: Repository<DepartmentUnitEntity>,
    @InjectRepository(CollegeDepartmentEntity)
    private readonly collegeDepartmentEntity: Repository<CollegeDepartmentEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseEntity: Repository<CourseEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
  ) {}

  public async getStatsForAdmin() {
    const totalAuthorities = await this.authorityRepository.count();
    const totalHospitals = await this.hospitalRepository.count();
    const totalDepartments = await this.departmentEntity.count();
    const totalDepartmentUnits = await this.departmentUnitEntity.count();

    const totalCollegeDepartments = await this.collegeDepartmentEntity.count();

    const totalClinicalCoordinators = await this.userEntity.count({
      where: { role: UserRoleEnum.CLINICAL_COORDINATOR },
    });

    const totalSupervisors = await this.userEntity.count({
      where: { role: UserRoleEnum.CLINICAL_SUPERVISOR },
    });

    const totalStudents = await this.userEntity.count({
      where: { role: UserRoleEnum.STUDENT },
    });

    const totalCourses = await this.courseEntity.count();

    return {
      totalAuthorities,
      totalHospitals,
      totalDepartments,
      totalDepartmentUnits,
      totalCollegeDepartments,
      totalCourses,
      totalClinicalCoordinators,
      totalSupervisors,
      totalStudents,
    };
  }

  public async getStatsForCoordinator(coordinatorId: string) {
    const allCourses = await this.courseEntity.find({
      where: { coordinator: { id: coordinatorId }, deletedAt: null },
    });

    const allCoursesIds = allCourses.map((c) => c.id);

    const totalStudents = await this.studentCourseRepository
      .createQueryBuilder('studentCourse')
      .leftJoin('studentCourse.student', 'student')
      .where('studentCourse.courseId IN (:...courseIds)', {
        courseIds: allCoursesIds,
      })
      .select('DISTINCT student.id')
      .getRawMany();

    return {
      totalCourses: allCourses.length,
      totalStudents: totalStudents.length,
    };
  }
}
