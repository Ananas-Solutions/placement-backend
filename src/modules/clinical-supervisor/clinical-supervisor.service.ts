import {
  DepartmentUnitEntity,
  SupervisorProfileEntity,
  UserEntity,
} from 'entities/index.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { DepartmentService } from 'department/department.service';

import {
  ClinicalSupervisorDepartmentUnitRepositoryService,
  ClinicalSupervisorProfileRepositoryService,
  TrainingTimeSlotRepositoryService,
} from 'repository/services';
import { HospitalService } from 'hospital/hospital.service';
import { UserService } from 'user/user.service';

import { SupervisorProfileDto, CreateSupervisorDto } from './dto';

@Injectable()
export class SupervisorService {
  constructor(
    private readonly supervisorProfileRepository: ClinicalSupervisorProfileRepositoryService,
    private readonly supervisorDepartmentUnit: ClinicalSupervisorDepartmentUnitRepositoryService,
    private readonly trainingTimeSlot: TrainingTimeSlotRepositoryService,
    private readonly userService: UserService,
    private readonly hospitalService: HospitalService,
    private readonly departmentService: DepartmentService,
  ) {}

  async createSupervisor(
    body: CreateSupervisorDto,
  ): Promise<ISuccessMessageResponse> {
    const { name, email, departmentUnitId } = body;
    const newUser = await this.userService.saveUser({
      name,
      email,
      password: 'password',
      role: UserRoleEnum.CLINICAL_SUPERVISOR,
      studentId: '',
    });

    await this.supervisorDepartmentUnit.save({
      supervisor: { id: newUser.id } as UserEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    return { message: 'Supervisor account created successfully.' };
  }

  async saveSupervisorProfile(
    userId: string,
    body: any,
  ): Promise<SupervisorProfileEntity> {
    try {
      const user = await this.userService.findUserById(userId);
      const hospital = await this.hospitalService.findOneHospital(
        body.hospital,
      );
      const department = await this.departmentService.findOneDepartment(
        body.department,
      );
      return await this.supervisorProfileRepository.save({
        ...body,
        user,
        hospital,
        department,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateSupervisorProfile(
    userId: string,
    body: SupervisorProfileDto,
  ): Promise<SupervisorProfileEntity> {
    try {
      const supervisorProfile = await this.supervisorProfileRepository.findOne({
        user: { id: userId },
      });

      return supervisorProfile;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchAllTimeSlots(supervisorId: string) {
    const supervisorTrainingTimeSlots = await this.trainingTimeSlot.findMany(
      {
        supervisor: { id: supervisorId },
      },
      {
        placements: true,
        trainingSite: {
          course: true,
          departmentUnit: { department: { hospital: true } },
        },
      },
    );

    const mappedTrainingSites = supervisorTrainingTimeSlots.map((timeSlot) => {
      const { id, day, startTime, endTime, placements, trainingSite } =
        timeSlot;
      const { departmentUnit, course } = trainingSite;
      const { department } = departmentUnit;
      const { hospital } = department;
      return {
        timeSlotId: id,
        trainingSiteId: trainingSite.id,
        hospital: hospital.name,
        department: department.name,
        departmentUnit: departmentUnit.name,
        day,
        startTime,
        endTime,
        course: {
          name: course.name,
          id: course.id,
        },
        totalStudents: placements.length,
      };
    });
    return mappedTrainingSites;
  }

  async fetchOneTimeSlot(timeSlotId: string) {
    const timeSlot = await this.trainingTimeSlot.findOne(
      {
        id: timeSlotId,
      },
      {
        placements: { student: true },
        trainingSite: {
          course: true,
          departmentUnit: { department: { hospital: true } },
        },
      },
    );

    const { id, day, startTime, endTime, placements, trainingSite } = timeSlot;
    const { departmentUnit, course } = trainingSite;
    const { department } = departmentUnit;
    const { hospital } = department;

    const mappedStudents = placements.map((placement) => {
      const { student } = placement;

      return {
        studentId: student.id,
        name: student.name,
        email: student.email,
      };
    });
    return {
      timeSlotId: id,
      trainingSiteId: trainingSite.id,
      hospital: hospital.name,
      department: department.name,
      departmentUnit: departmentUnit.name,
      day,
      startTime,
      endTime,
      course: {
        name: course.name,
        id: course.id,
      },
      totalStudents: placements.length,
      students: mappedStudents,
    };
  }
}
