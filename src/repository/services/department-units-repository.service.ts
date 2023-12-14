import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DepartmentUnitEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class DepartmentUnitsRepositoryService {
  constructor(
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitRepository: Repository<DepartmentUnitEntity>,
  ) {}

  public async save(
    data: SaveOptions<DepartmentUnitEntity>,
  ): Promise<DepartmentUnitEntity> {
    return await this.departmentUnitRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<DepartmentUnitEntity>,
    relations?: FindRelationsOptions<DepartmentUnitEntity>,
  ): Promise<DepartmentUnitEntity> {
    return await this.departmentUnitRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<DepartmentUnitEntity>,
    relations?: FindRelationsOptions<DepartmentUnitEntity>,
    findManyOptions?: FindManyOptions<DepartmentUnitEntity>,
  ): Promise<DepartmentUnitEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.departmentUnitRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async count(
    where?: FindOneWhereOptions<DepartmentUnitEntity>,
    relations?: FindRelationsOptions<DepartmentUnitEntity>,
  ): Promise<number> {
    return await this.departmentUnitRepository.count({
      where,
      relations,
    });
  }

  public async update(
    where: FindOneWhereOptions<DepartmentUnitEntity>,
    data: UpdateOptions<DepartmentUnitEntity>,
  ) {
    return await this.departmentUnitRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<DepartmentUnitEntity>,
    relations?: FindRelationsOptions<DepartmentUnitEntity>,
  ) {
    const departmentUnit = await this.departmentUnitRepository.findOne({
      where,
      relations,
    });

    await this.departmentUnitRepository.softRemove(departmentUnit);
  }
}
