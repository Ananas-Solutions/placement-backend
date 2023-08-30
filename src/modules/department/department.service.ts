import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { DepartmentEntity } from 'entities/department.entity';
import { HospitalEntity } from 'entities/hospital.entity';

import { DepartmentDto } from './dto';
import {
  IDepartmentCoordinatorResponse,
  IDepartmentDetailResponse,
  IDepartmentResponse,
} from './response';
import { CoordinatorCollegeDepartmentEntity } from 'entities/coordinator-college-department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(CoordinatorCollegeDepartmentEntity)
    private readonly coordinatorDepartmentRepository: Repository<CoordinatorCollegeDepartmentEntity>,
  ) {}

  async saveDepartment(bodyDto: DepartmentDto): Promise<IDepartmentResponse> {
    const { hospitalId, name, contactEmail } = bodyDto;
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name, hospital: { id: hospitalId } },
    });
    if (existingDepartment) {
      throw new ConflictException(
        'Department with the same name exists for this hospital.',
      );
    }

    const newDepartment = await this.departmentRepository.save({
      name,
      contactEmail,
      hospital: { id: hospitalId } as HospitalEntity,
    });

    return this.transformToResponse(newDepartment);
  }

  async findAllHospitals(): Promise<IDepartmentDetailResponse[]> {
    const allDepartments = await this.departmentRepository.find({
      loadEagerRelations: false,
      relations: ['hospital'],
    });

    return allDepartments.map((department) =>
      this.transformToDetailResponse(department),
    );
  }

  async findHospitalDepartments(
    hospitalId: string,
  ): Promise<IDepartmentResponse[]> {
    const allDepartmentsOfHospital = await this.departmentRepository.find({
      where: { hospital: { id: hospitalId } },
      loadEagerRelations: false,
    });

    return allDepartmentsOfHospital.map((department) =>
      this.transformToResponse(department),
    );
  }

  async findOneDepartment(
    departmentId: string,
  ): Promise<IDepartmentDetailResponse> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      loadEagerRelations: false,
      relations: ['hospital'],
    });

    return this.transformToDetailResponse(department);
  }

  async findDepartmentCoordinators(departmentId: string) {
    const departmentCoordinators =
      await this.coordinatorDepartmentRepository.find({
        where: { department: { id: departmentId } },
        loadEagerRelations: false,
        relations: ['coordinator'],
      });

    return departmentCoordinators.map((departmentCoordinator) =>
      this.transformToCoordinatorResponse(departmentCoordinator),
    );
  }

  async updateOneDepartment(
    departmentId: string,
    bodyDto: DepartmentDto,
  ): Promise<any> {
    const { hospitalId, name } = bodyDto;
    await this.departmentRepository.update(
      { id: departmentId },
      {
        name,
        hospital: { id: hospitalId } as HospitalEntity,
      },
    );

    const updatedDepartment = await this.departmentRepository.findOne({
      where: { id: departmentId },
      loadEagerRelations: false,
    });

    return this.transformToResponse(updatedDepartment);
  }

  async deleteOneDepartment(id: string): Promise<ISuccessMessageResponse> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    await this.departmentRepository.softRemove(department);

    return { message: 'Department deleted successfully' };
  }

  private transformToResponse(entity: DepartmentEntity): IDepartmentResponse {
    const { id, name, contactEmail } = entity;

    return {
      id,
      name,
      contactEmail,
    };
  }

  private transformToDetailResponse(
    entity: DepartmentEntity,
  ): IDepartmentDetailResponse {
    const { id, name, hospital, contactEmail } = entity;

    return {
      id,
      name,
      contactEmail,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        contactEmail: hospital.contactEmail,
      },
    };
  }

  private transformToCoordinatorResponse(
    entity: CoordinatorCollegeDepartmentEntity,
  ): IDepartmentCoordinatorResponse {
    const { coordinator } = entity;

    return {
      coordinatorId: coordinator.id,
      coordinatorName: coordinator.name,
    };
  }
}
