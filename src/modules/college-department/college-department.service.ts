import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';

import { CollegeDepartmentDto } from './dto';
import { ICollegeDepartmentResponse } from './response';

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
    });

    return this.transformToResponse(collegeDepartment);
  }

  async findAll(): Promise<ICollegeDepartmentResponse[]> {
    const allCollegeDepartments = await this.collegeDepartmentRepository.find();

    return allCollegeDepartments.map((department) =>
      this.transformToResponse(department),
    );
  }

  async update(
    departmentId: string,
    bodyDto: CollegeDepartmentDto,
  ): Promise<ICollegeDepartmentResponse> {
    const { name } = bodyDto;
    await this.collegeDepartmentRepository.update(
      { id: departmentId },
      {
        name,
      },
    );

    const updatedCollegeDepartment =
      await this.collegeDepartmentRepository.findOne({
        where: { id: departmentId },
      });

    return this.transformToResponse(updatedCollegeDepartment);
  }

  async delete(id: string): Promise<ISuccessMessageResponse> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where: { id },
    });
    await this.collegeDepartmentRepository.softRemove(collegeDepartment);

    return { message: 'College department deleted successfully' };
  }

  private transformToResponse(entity: CollegeDepartmentEntity) {
    const { id, name } = entity;

    return {
      id,
      name,
    };
  }
}
