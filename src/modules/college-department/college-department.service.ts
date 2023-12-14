import { ConflictException, Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';
import { CollegeDepartmentRepositoryService } from 'repository/services';

import { CollegeDepartmentDto } from './dto';
import { ICollegeDepartmentResponse } from './response';

@Injectable()
export class CollegeDepartmentService {
  constructor(
    private readonly collegeDepartmentRepository: CollegeDepartmentRepositoryService,
  ) {}

  async save(body: CollegeDepartmentDto): Promise<ICollegeDepartmentResponse> {
    const department = await this.collegeDepartmentRepository.findOne({
      name: body.name,
    });

    if (department) {
      throw new ConflictException('Department already exists');
    }

    const newDepartment = await this.collegeDepartmentRepository.save(body);
    return this.transformToResponse(newDepartment);
  }

  async findOne(id: string): Promise<ICollegeDepartmentResponse> {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      id,
    });

    return this.transformToResponse(collegeDepartment);
  }

  async findAll(): Promise<ICollegeDepartmentResponse[]> {
    const allCollegeDepartments =
      await this.collegeDepartmentRepository.findMany();

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
        id: departmentId,
      });

    return this.transformToResponse(updatedCollegeDepartment);
  }

  async delete(id: string): Promise<ISuccessMessageResponse> {
    await this.collegeDepartmentRepository.delete({
      id,
    });

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
