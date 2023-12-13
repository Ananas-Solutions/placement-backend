import { ConflictException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import {
  CoordinatorCollegeDepartmentEntity,
  DepartmentEntity,
  HospitalEntity,
} from 'entities/index.entity';
import {
  CoordinatorCollegeDepartmentRepositoryService,
  DepartmentRepositoryService,
} from 'repository/services';

import { DepartmentDto } from './dto';
import {
  IDepartmentCoordinatorResponse,
  IDepartmentDetailResponse,
  IDepartmentResponse,
} from './response';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository: DepartmentRepositoryService,
    private readonly coordinatorDepartmentRepository: CoordinatorCollegeDepartmentRepositoryService,
  ) {}

  async saveDepartment(bodyDto: DepartmentDto): Promise<IDepartmentResponse> {
    const { hospitalId, name, contactEmail } = bodyDto;
    const existingDepartment = await this.departmentRepository.findOne({
      name,
      hospital: { id: hospitalId },
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
    const allDepartments = await this.departmentRepository.findMany(
      {},
      {
        hospital: true,
      },
    );

    return allDepartments.map((department) =>
      this.transformToDetailResponse(department),
    );
  }

  async findHospitalDepartments(
    hospitalIds: string[],
  ): Promise<IDepartmentResponse[]> {
    const allDepartmentsOfHospital = await this.departmentRepository.findMany({
      hospital: { id: In(hospitalIds) },
    });

    return allDepartmentsOfHospital.map((department) =>
      this.transformToResponse(department),
    );
  }

  async findOneDepartment(
    departmentId: string,
  ): Promise<IDepartmentDetailResponse> {
    const department = await this.departmentRepository.findOne(
      {
        id: departmentId,
      },
      { hospital: true },
    );

    return this.transformToDetailResponse(department);
  }

  async findDepartmentCoordinators(departmentId: string) {
    const departmentCoordinators =
      await this.coordinatorDepartmentRepository.findMany(
        {
          department: { id: departmentId },
        },
        { coordinator: true },
      );

    return departmentCoordinators.map((departmentCoordinator) =>
      this.transformToCoordinatorResponse(departmentCoordinator),
    );
  }

  async updateOneDepartment(
    departmentId: string,
    bodyDto: DepartmentDto,
  ): Promise<any> {
    const { hospitalId, name, contactEmail } = bodyDto;
    await this.departmentRepository.update(
      { id: departmentId },
      {
        name,
        contactEmail,
        hospital: { id: hospitalId } as HospitalEntity,
      },
    );

    const updatedDepartment = await this.departmentRepository.findOne({
      id: departmentId,
    });

    return this.transformToResponse(updatedDepartment);
  }

  async deleteOneDepartment(id: string): Promise<ISuccessMessageResponse> {
    await this.departmentRepository.delete(
      {
        id,
      },
      { departmentUnits: true },
    );

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
