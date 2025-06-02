import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';

import { DataResponse, SuccessMessageResponse } from 'commons/response';
import { DepartmentEntity } from 'entities/department.entity';
import { HospitalEntity } from 'entities/hospital.entity';

import { DepartmentDto, QueryHospitalDepartmentDto } from './dto';
import { IDepartmentCoordinatorResponse } from './response';
import { CoordinatorCollegeDepartmentEntity } from 'entities/coordinator-college-department.entity';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(CoordinatorCollegeDepartmentEntity)
    private readonly coordinatorDepartmentRepository: Repository<CoordinatorCollegeDepartmentEntity>,
  ) {}

  async saveDepartment(
    bodyDto: DepartmentDto,
  ): Promise<DataResponse<DepartmentEntity>> {
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

    return {
      data: newDepartment,
      message: 'Department created successfully',
    };
  }

  async findAllDepartments(
    query: SearchQueryDto,
  ): Promise<DataResponse<DepartmentEntity[]>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<DepartmentEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allDepartments, totalItems] =
      await this.departmentRepository.findAndCount({
        where,
        loadEagerRelations: false,
        relations: {
          hospital: true,
        },
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allDepartments.filter(Boolean),
      message: 'Departments fetched successfully',
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async findHospitalDepartments(
    query: QueryHospitalDepartmentDto,
  ): Promise<DataResponse<DepartmentEntity[]>> {
    const { hospitalIds, page, limit, search } = query;
    const where: FindOptionsWhere<DepartmentEntity> = {};

    if (hospitalIds.length > 0) {
      where.hospital = { id: In(hospitalIds) };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const skip = (page - 1) * limit;

    const [allDepartmentsOfHospital, totalItems] =
      await this.departmentRepository.findAndCount({
        where,
        loadEagerRelations: false,
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allDepartmentsOfHospital,
      message: 'Departments fetched successfully',
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async findOneDepartment(
    departmentId: string,
  ): Promise<DataResponse<DepartmentEntity>> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      loadEagerRelations: false,
      relations: ['hospital'],
    });

    return {
      data: department,
    };
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
  ): Promise<DataResponse<DepartmentEntity>> {
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
      where: { id: departmentId },
      loadEagerRelations: false,
    });

    return {
      data: updatedDepartment,
      message: 'Department updated successfully',
    };
  }

  async deleteOneDepartment(id: string): Promise<SuccessMessageResponse> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    await this.departmentRepository.softRemove(department);

    return { message: 'Department deleted successfully' };
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
