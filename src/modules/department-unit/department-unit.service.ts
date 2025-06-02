import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';

import { DataResponse, SuccessMessageResponse } from 'commons/response';
import { DepartmentResponse } from 'department/response';
import { DepartmentUnitEntity, DepartmentEntity } from 'entities/index.entity';

import { DepartmentUnitsDto, QueryDepartmentUnitsDto } from './dto';
import {
  IDepartmentUnitDetailResponse,
  IDepartmentUnitResponse,
} from './response';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class DepartmentUnitsService {
  constructor(
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitsRepository: Repository<DepartmentUnitEntity>,
  ) {}

  async save(
    bodyDto: DepartmentUnitsDto,
  ): Promise<DataResponse<DepartmentUnitEntity>> {
    const { departmentId, name, contactEmail } = bodyDto;
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
      contactEmail,
      department: { id: departmentId } as DepartmentEntity,
    });

    return {
      data: newDepartmentUnit,
      message: 'Department unit created successfully',
    };
  }

  async findAll(
    query: SearchQueryDto,
  ): Promise<DataResponse<DepartmentUnitEntity[]>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<DepartmentUnitEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allDepartmentUnits, totalItems] =
      await this.departmentUnitsRepository.findAndCount({
        where,
        loadEagerRelations: false,
        relations: [
          'department',
          'department.hospital',
          'department.hospital.authority',
        ],
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allDepartmentUnits,
      message: 'Department units fetched successfully',
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async findOne(id: string): Promise<DataResponse<DepartmentUnitEntity>> {
    const departmentUnit = await this.departmentUnitsRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: [
        'department',
        'department.hospital',
        'department.hospital.authority',
      ],
    });
    return {
      data: departmentUnit,
    };
  }

  async find(
    query: QueryDepartmentUnitsDto,
  ): Promise<DataResponse<DepartmentUnitEntity[]>> {
    const { departmentIds, page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<DepartmentUnitEntity> = {};

    if (departmentIds.length > 0) {
      where.department = { id: In(departmentIds) };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allDepartmentUnits, totalItems] =
      await this.departmentUnitsRepository.findAndCount({
        where,
        loadEagerRelations: false,
        relations: [
          'department',
          'department.hospital',
          'department.hospital.authority',
        ],
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allDepartmentUnits,
      message: 'Department units fetched successfully',
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async update(
    departmentUnitId: string,
    bodyDto: DepartmentUnitsDto,
  ): Promise<DataResponse<DepartmentUnitEntity>> {
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
      where: { id: departmentUnitId },
      loadEagerRelations: false,
    });

    return {
      data: updatedDepartmentUnit,
      message: 'Department unit updated successfully',
    };
  }

  async delete(departmentUnitId: string): Promise<SuccessMessageResponse> {
    const departmentUnit = await this.departmentUnitsRepository.findOne({
      where: { id: departmentUnitId },
    });
    await this.departmentUnitsRepository.softRemove(departmentUnit);

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
    if (!hospital) {
      return null;
    }

    const { authority } = hospital;

    if (!authority) {
      return null;
    }

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
