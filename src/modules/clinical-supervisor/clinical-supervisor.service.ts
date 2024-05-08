import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { DepartmentService } from 'department/department.service';
import { SupervisorDepartmentUnitEntity } from 'entities/clinical-supervisor-department-unit.entity';
import { SupervisorProfileEntity } from 'entities/clinical-supervisor-profile.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';
import { UserEntity } from 'entities/user.entity';
import { HospitalService } from 'hospital/hospital.service';
import { UserService } from 'user/user.service';

import { SupervisorProfileDto, CreateSupervisorDto } from './dto';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorProfileEntity)
    private readonly supervisorProfileRepository: Repository<SupervisorProfileEntity>,
    @InjectRepository(SupervisorDepartmentUnitEntity)
    private readonly supervisorDepartmentUnit: Repository<SupervisorDepartmentUnitEntity>,
    @InjectRepository(TrainingTimeSlotEntity)
    private readonly trainingTimeSlot: Repository<TrainingTimeSlotEntity>,
    @InjectRepository(BlockTrainingTimeSlotEntity)
    private readonly blockTrainingTimeSlot: Repository<BlockTrainingTimeSlotEntity>,
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
        where: { user: { id: userId } },
      });
      return supervisorProfile;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchAllTimeSlots(supervisorId: string) {
    const fetchSupervisorTrainingTimeSlots = this.trainingTimeSlot.find({
      where: { supervisor: { id: supervisorId } },
      loadEagerRelations: false,
      relations: {
        placements: true,
        trainingSite: {
          course: true,
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
        },
      },
    });

    const fetchSupervisorBlockTrainingTimeSlots =
      this.blockTrainingTimeSlot.find({
        where: { supervisor: { id: supervisorId } },
        loadEagerRelations: false,
        relations: {
          placements: true,
          blockTrainingSite: {
            block: {
              course: true,
            },
            departmentUnit: {
              department: {
                hospital: true,
              },
            },
          },
        },
      });

    const [supervisorTrainingTimeSlots, supervisorBlockTrainingTimeSlots] =
      await Promise.all([
        fetchSupervisorTrainingTimeSlots,
        fetchSupervisorBlockTrainingTimeSlots,
      ]);

    const mappedTrainingSites = supervisorTrainingTimeSlots.map((timeSlot) => {
      const { id, day, startTime, endTime, placements } = timeSlot;
      const { departmentUnit, course } = timeSlot.trainingSite;
      const trainingSite = timeSlot.trainingSite;
      const { department } = departmentUnit;
      const { hospital } = department;
      return {
        timeSlotId: id,
        trainingSiteId: trainingSite.id,
        hospital: {
          id: hospital.id,
          name: hospital.name,
          location: hospital.location as any,
        },
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

    const mappedBlockTrainingSites = supervisorBlockTrainingTimeSlots.map(
      (timeSlot) => {
        const { id, day, startTime, endTime, placements, blockTrainingSite } =
          timeSlot;
        const { departmentUnit } = timeSlot.blockTrainingSite;
        const { course } = blockTrainingSite.block;
        const { department } = departmentUnit;
        const { hospital } = department;
        return {
          timeSlotId: id,
          trainingSiteId: blockTrainingSite.id,
          hospital: {
            id: hospital.id,
            name: hospital.name,
            location: hospital.location as any,
          },
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
      },
    );

    return [...mappedTrainingSites, ...mappedBlockTrainingSites];
  }

  async fetchOneTimeSlot(timeSlotId: string) {
    const timeSlot = await this.trainingTimeSlot.findOne({
      where: { id: timeSlotId },
      relations: {
        placements: true,
        trainingSite: {
          course: true,
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
        },
      },
    });

    if (timeSlot) {
      const { id, day, startTime, endTime, placements, trainingSite } =
        timeSlot;
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

    const blockTimeSlot = await this.blockTrainingTimeSlot.findOne({
      where: { id: timeSlotId },
      relations: {
        placements: true,
        blockTrainingSite: {
          block: {
            course: true,
          },
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
        },
      },
    });

    const { id, day, startTime, endTime, placements, blockTrainingSite } =
      blockTimeSlot;
    const { departmentUnit } = blockTrainingSite;
    const course = blockTrainingSite.block.course;
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
      trainingSiteId: blockTrainingSite.id,
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
