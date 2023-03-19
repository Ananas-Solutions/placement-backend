import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { DepartmentService } from 'src/department/department.service';
import { HospitalService } from 'src/hospital/hospital.service';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/types/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SupervisorProfileDto } from './dto/clinicalSupervisorProfile.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { SupervisorDepartmentUnit } from './entity/clinical-supervisor-department-unit.entity';
import { SupervisorProfile } from './entity/clinicalSupervisorProfile.entity';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorProfile)
    private readonly supervisorProfileRepository: Repository<SupervisorProfile>,
    @InjectRepository(SupervisorDepartmentUnit)
    private readonly supervisorDepartmentUnit: Repository<SupervisorDepartmentUnit>,
    @InjectRepository(TrainingTimeSlot)
    private readonly trainingTimeSlot: Repository<TrainingTimeSlot>,
    private readonly userService: UserService,
    private readonly hospitalService: HospitalService,
    private readonly departmentService: DepartmentService,
  ) {}

  async createSupervisor(body: CreateSupervisorDto) {
    const { name, email, departmentUnitId } = body;
    const newUser = await this.userService.saveUser({
      name,
      email,
      password: 'password',
      role: UserRole.CLINICAL_SUPERVISOR,
      studentId: '',
    });
    await this.supervisorDepartmentUnit.save({
      supervisor: { id: newUser.id } as User,
      departmentUnit: { id: departmentUnitId } as DepartmentUnits,
    });
    return newUser;
  }

  async saveSupervisorProfile(
    userId: string,
    body: any,
  ): Promise<SupervisorProfile> {
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
  ): Promise<SupervisorProfile> {
    try {
      const supervisorProfile = await this.supervisorProfileRepository.findOne({
        where: { user: userId },
      });
      return;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchAllTimeSlots(supervisorId: string) {
    const supervisorTrainingTimeSlots = await this.trainingTimeSlot.find({
      where: { supervisor: { id: supervisorId } },
      relations: [
        'placements',
        'trainingSite',
        'trainingSite.course',
        'trainingSite.departmentUnit',
        'trainingSite.departmentUnit.department',
        'trainingSite.departmentUnit.department.hospital',
      ],
    });

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
    const timeSlot = await this.trainingTimeSlot.findOne({
      where: { id: timeSlotId },
      relations: [
        'placements',
        'placements.student',
        'trainingSite',
        'trainingSite.course',
        'trainingSite.departmentUnit',
        'trainingSite.departmentUnit.department',
        'trainingSite.departmentUnit.department.hospital',
      ],
    });

    const { id, day, startTime, endTime, placements, trainingSite } = timeSlot;
    const { departmentUnit, course } = trainingSite;
    const { department } = departmentUnit;
    const { hospital } = department;

    const mappedStudents = placements.map((placement) => {
      const { student } = placement;
      console.log('student', student);
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
