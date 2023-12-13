import { ConflictException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { IDepartmentResponse } from 'department/response';
import { DepartmentUnitEntity, DepartmentEntity } from 'entities/index.entity';

import { DepartmentUnitsDto } from './dto';
import {
  IDepartmentUnitDetailResponse,
  IDepartmentUnitResponse,
} from './response';
import { DepartmentUnitsRepositoryService } from 'repository/services';

@Injectable()
export class DepartmentUnitsService {
  constructor(
    private readonly departmentUnitsRepository: DepartmentUnitsRepositoryService,
  ) {}

  async save(bodyDto: DepartmentUnitsDto): Promise<IDepartmentUnitResponse> {
    const { departmentId, name, contactEmail } = bodyDto;
    const existingDepartmentUnit = await this.departmentUnitsRepository.findOne(
      { name, department: { id: departmentId } },
    );

    if (existingDepartmentUnit) {
      throw new ConflictException(
        'Department Unit with same name exists for this department.',
      );
    }

    const newDepartmentUnit = await this.departmentUnitsRepository.save({
      name,
      contactEmail,
      department: { id: departmentId } as DepartmentEntity,
    });

    return this.transformToResponse(newDepartmentUnit);
  }

  async findAll(): Promise<IDepartmentUnitDetailResponse[]> {
    const allDepartmentUnits = await this.departmentUnitsRepository.findMany(
      {},
      { department: { hospital: { authority: true } } },
    );

    return allDepartmentUnits.map((departmentUnit) =>
      this.transformToDetailResponse(departmentUnit),
    );
  }

  async findOne(id: string): Promise<IDepartmentUnitDetailResponse> {
    const departmentUnit = await this.departmentUnitsRepository.findOne(
      {
        id,
      },
      { department: { hospital: { authority: true } } },
    );
    return this.transformToDetailResponse(departmentUnit);
  }

  async find(departmentIds: string[]): Promise<IDepartmentResponse[]> {
    const allDepartmentUnits = await this.departmentUnitsRepository.findMany({
      department: { id: In(departmentIds) },
    });

    return allDepartmentUnits.map((departmentUnit) =>
      this.transformToResponse(departmentUnit),
    );
  }

  async update(
    departmentUnitId: string,
    bodyDto: DepartmentUnitsDto,
  ): Promise<IDepartmentUnitResponse> {
    const { departmentId, name, contactEmail } = bodyDto;
    await this.departmentUnitsRepository.update(
      { id: departmentUnitId },
      {
        name,
        contactEmail,
        department: { id: departmentId } as DepartmentEntity,
      },
    );

    const updatedDepartmentUnit = await this.departmentUnitsRepository.findOne({
      id: departmentUnitId,
    });

    return this.transformToResponse(updatedDepartmentUnit);
  }

  async delete(departmentUnitId: string): Promise<ISuccessMessageResponse> {
    await this.departmentUnitsRepository.delete({
      id: departmentUnitId,
    });

    return { message: 'Department unit removed successfully.' };
  }

  private transformToResponse(
    departmentUnit: DepartmentUnitEntity,
  ): IDepartmentUnitResponse {
    const { id, name, contactEmail } = departmentUnit;
    return {
      id,
      name,
      contactEmail,
    };
  }

  private transformToDetailResponse(
    departmentUnit: DepartmentUnitEntity,
  ): IDepartmentUnitDetailResponse {
    const { id, name, department, contactEmail } = departmentUnit;
    const { hospital } = department;
    const { authority } = hospital;

    return {
      id,
      name,
      contactEmail,
      department: {
        id: department.id,
        name: department.name,
        contactEmail: department.contactEmail,
      },
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        contactEmail: hospital.contactEmail,
      },
      authority: {
        id: authority.id,
        name: authority.name,
        initials: authority.initials,
        contactEmail: authority.contactEmail,
      },
    };
  }
}
