import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { IDepartmentResponse } from 'department/response';
import { DepartmentUnitEntity, DepartmentEntity } from 'entities/index.entity';

import { DepartmentUnitsDto } from './dto';
import {
  IDepartmentUnitDetailResponse,
  IDepartmentUnitResponse,
} from './response';

@Injectable()
export class DepartmentUnitsService {
  constructor(
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitsRepository: Repository<DepartmentUnitEntity>,
  ) {}

  async save(bodyDto: DepartmentUnitsDto): Promise<IDepartmentUnitResponse> {
    const { departmentId, name } = bodyDto;
    const existingDepartmentUnit = await this.departmentUnitsRepository.findOne(
      { where: { name, department: { id: departmentId } } },
    );
    if (existingDepartmentUnit) {
      throw new ConflictException(
        'Department Unit with same name exists for this department.',
      );
    }

    const newDepartmentUnit = await this.departmentUnitsRepository.save({
      name,
      department: { id: departmentId } as DepartmentEntity,
    });

    return this.transformToResponse(newDepartmentUnit);
  }

  async findAll(): Promise<IDepartmentUnitDetailResponse[]> {
    const allDepartmentUnits = await this.departmentUnitsRepository.find({
      loadEagerRelations: false,
      relations: [
        'department',
        'department.hospital',
        'department.hospital.authority',
      ],
    });

    return allDepartmentUnits.map((departmentUnit) =>
      this.transformToDetailResponse(departmentUnit),
    );
  }

  async findOne(id: string): Promise<IDepartmentUnitDetailResponse> {
    const departmentUnit = await this.departmentUnitsRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: [
        'department',
        'department.hospital',
        'department.hospital.authority',
      ],
    });
    return this.transformToDetailResponse(departmentUnit);
  }

  async find(departmentId: string): Promise<IDepartmentResponse[]> {
    const allDepartmentUnits = await this.departmentUnitsRepository.find({
      where: { department: { id: departmentId } },
      loadEagerRelations: false,
    });

    return allDepartmentUnits.map((departmentUnit) =>
      this.transformToResponse(departmentUnit),
    );
  }

  async update(
    departmentUnitId: string,
    bodyDto: DepartmentUnitsDto,
  ): Promise<IDepartmentUnitResponse> {
    const { departmentId, name } = bodyDto;
    await this.departmentUnitsRepository.update(
      { id: departmentUnitId },
      {
        name,
        department: { id: departmentId } as DepartmentEntity,
      },
    );

    const updatedDepartmentUnit = await this.departmentUnitsRepository.findOne({
      where: { id: departmentUnitId },
      loadEagerRelations: false,
    });

    return this.transformToResponse(updatedDepartmentUnit);
  }

  async delete(departmentUnitId: string): Promise<ISuccessMessageResponse> {
    const departmentUnit = await this.departmentUnitsRepository.findOne({
      where: { id: departmentUnitId },
    });
    await this.departmentUnitsRepository.softRemove(departmentUnit);

    return { message: 'Department unit removed successfully.' };
  }

  private transformToResponse(
    departmentUnit: DepartmentUnitEntity,
  ): IDepartmentUnitResponse {
    const { id, name } = departmentUnit;
    return {
      id,
      name,
    };
  }

  private transformToDetailResponse(
    departmentUnit: DepartmentUnitEntity,
  ): IDepartmentUnitDetailResponse {
    const { id, name, department } = departmentUnit;
    const { hospital } = department;
    const { authority } = hospital;

    return {
      id,
      name,
      department: {
        id: department.id,
        name: department.name,
      },
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
      },
      authority: {
        id: authority.id,
        name: authority.name,
        initials: authority.initials,
      },
    };
  }
}
