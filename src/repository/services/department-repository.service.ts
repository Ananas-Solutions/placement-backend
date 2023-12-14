import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DepartmentEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class DepartmentRepositoryService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  public async save(
    data: SaveOptions<DepartmentEntity>,
  ): Promise<DepartmentEntity> {
    return await this.departmentRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<DepartmentEntity>,
    relations?: FindRelationsOptions<DepartmentEntity>,
  ): Promise<DepartmentEntity> {
    return await this.departmentRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<DepartmentEntity>,
    relations?: FindRelationsOptions<DepartmentEntity>,
    findManyOptions?: FindManyOptions<DepartmentEntity>,
  ): Promise<DepartmentEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.departmentRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async count(
    where?: FindOneWhereOptions<DepartmentEntity>,
    relations?: FindRelationsOptions<DepartmentEntity>,
  ): Promise<number> {
    return await this.departmentRepository.count({
      where,
      relations,
    });
  }

  public async update(
    where: FindOneWhereOptions<DepartmentEntity>,
    data: UpdateOptions<DepartmentEntity>,
  ) {
    return await this.departmentRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<DepartmentEntity>,
    relations?: FindRelationsOptions<DepartmentEntity>,
  ) {
    const department = await this.departmentRepository.findOne({
      where,
      relations,
    });

    await this.departmentRepository.softRemove(department);
  }
}
