import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupervisorDepartmentUnitEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class ClinicalSupervisorDepartmentUnitRepositoryService {
  constructor(
    @InjectRepository(SupervisorDepartmentUnitEntity)
    private readonly supervisorDepartmentUnitRepository: Repository<SupervisorDepartmentUnitEntity>,
  ) {}

  public async save(
    data: SaveOptions<SupervisorDepartmentUnitEntity>,
  ): Promise<SupervisorDepartmentUnitEntity> {
    return await this.supervisorDepartmentUnitRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<SupervisorDepartmentUnitEntity>,
    relations?: FindRelationsOptions<SupervisorDepartmentUnitEntity>,
  ): Promise<SupervisorDepartmentUnitEntity> {
    return await this.supervisorDepartmentUnitRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<SupervisorDepartmentUnitEntity>,
    relations?: FindRelationsOptions<SupervisorDepartmentUnitEntity>,
    findManyOptions?: FindManyOptions<SupervisorDepartmentUnitEntity>,
  ): Promise<SupervisorDepartmentUnitEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.supervisorDepartmentUnitRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<SupervisorDepartmentUnitEntity>,
    data: UpdateOptions<SupervisorDepartmentUnitEntity>,
  ) {
    return await this.supervisorDepartmentUnitRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<SupervisorDepartmentUnitEntity>,
    relations?: FindRelationsOptions<SupervisorDepartmentUnitEntity>,
  ) {
    const supervisorDepartmentUnit =
      await this.supervisorDepartmentUnitRepository.findOne({
        where,
        relations,
      });

    await this.supervisorDepartmentUnitRepository.softRemove(
      supervisorDepartmentUnit,
    );
  }
}
