import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { SuccessMessageResponse } from 'commons/response';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';

import { CollegeDepartmentDto } from './dto';
import { ICollegeDepartmentResponse } from './response';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class CollegeDepartmentService {
  constructor(
    @InjectRepository(CollegeDepartmentEntity)
    private readonly collegeDepartmentRepository: Repository<CollegeDepartmentEntity>,
  ) {}

  async save(body: CollegeDepartmentDto): Promise<ICollegeDepartmentResponse> {
    const department = await this.collegeDepartmentRepository.findOne({
      where: { name: body.name },
    });
    if (department) {
      throw new ConflictException('Department already exists');
    }

    const newDepartment = await this.collegeDepartmentRepository.save(body);
    return this.transformToResponse(newDepartment);
  }

  async findOne(id: string): Promise<ICollegeDepartmentResponse> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });

    return this.transformToResponse(collegeDepartment);
  }

  async findAll(query: SearchQueryDto): Promise<ICollegeDepartmentResponse[]> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<CollegeDepartmentEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const allCollegeDepartments = await this.collegeDepartmentRepository.find({
      where,
      loadEagerRelations: false,
      order: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    return allCollegeDepartments.map((department) =>
      this.transformToResponse(department),
    );
  }

  async update(
    departmentId: string,
    bodyDto: CollegeDepartmentDto,
  ): Promise<ICollegeDepartmentResponse> {
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

    return this.transformToResponse(updatedCollegeDepartment);
  }

  async delete(id: string): Promise<SuccessMessageResponse> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where: { id },
    });
    await this.collegeDepartmentRepository.softRemove(collegeDepartment);

    return { message: 'College department deleted successfully' };
  }

  private transformToResponse(entity: CollegeDepartmentEntity) {
    const { id, name, contactEmail } = entity;

    return {
      id,
      name,
      contactEmail,
    };
  }
}
