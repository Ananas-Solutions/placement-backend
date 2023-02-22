import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { DepartmentService } from 'src/department/department.service';
import { HospitalService } from 'src/hospital/hospital.service';
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
}
