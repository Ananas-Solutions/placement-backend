import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { DataResponse, SuccessMessageResponse } from 'commons/response';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';

import { CollegeDepartmentDto } from './dto';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class CollegeDepartmentService {
  constructor(
    @InjectRepository(CollegeDepartmentEntity)
    private readonly collegeDepartmentRepository: Repository<CollegeDepartmentEntity>,
  ) {}

  async save(
    body: CollegeDepartmentDto,
  ): Promise<DataResponse<CollegeDepartmentEntity>> {
    const department = await this.collegeDepartmentRepository.findOne({
      where: { name: body.name },
    });
    if (department) {
      throw new ConflictException('Department already exists');
    }

    const newDepartment = await this.collegeDepartmentRepository.save(body);
    return {
      message: 'Department created successfully',
      data: newDepartment,
    };
  }

  async findOne(id: string): Promise<DataResponse<CollegeDepartmentEntity>> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });

    return { data: collegeDepartment };
  }

  async findAll(
    query: SearchQueryDto,
  ): Promise<DataResponse<CollegeDepartmentEntity[]>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<CollegeDepartmentEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allCollegeDepartments, totalItems] =
      await this.collegeDepartmentRepository.findAndCount({
        where,
        loadEagerRelations: false,
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allCollegeDepartments,
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async update(
    departmentId: string,
    bodyDto: CollegeDepartmentDto,
  ): Promise<DataResponse<CollegeDepartmentEntity>> {
    const { name, contactEmail } = bodyDto;
    await this.collegeDepartmentRepository.update(
      { id: departmentId },
      {
        name,
        contactEmail,
      },
    );

    const updatedCollegeDepartment =
      await this.collegeDepartmentRepository.findOne({
        where: { id: departmentId },
        loadEagerRelations: false,
      });

    return {
      message: 'Department updated successfully',
      data: updatedCollegeDepartment,
    };
  }

  async delete(id: string): Promise<SuccessMessageResponse> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where: { id },
    });
    await this.collegeDepartmentRepository.softRemove(collegeDepartment);

    return { message: 'College department deleted successfully' };
  }
}
