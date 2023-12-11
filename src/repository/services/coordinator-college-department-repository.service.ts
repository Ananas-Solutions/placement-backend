import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoordinatorCollegeDepartmentEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class CoordinatorCollegeDepartmentRepositoryService {
  constructor(
    @InjectRepository(CoordinatorCollegeDepartmentEntity)
    private readonly coordinatorCollegeDepartmentRepository: Repository<CoordinatorCollegeDepartmentEntity>,
  ) {}

  public async save(
    data: SaveOptions<CoordinatorCollegeDepartmentEntity>,
  ): Promise<CoordinatorCollegeDepartmentEntity> {
    return await this.coordinatorCollegeDepartmentRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<CoordinatorCollegeDepartmentEntity>,
    relations?: FindRelationsOptions<CoordinatorCollegeDepartmentEntity>,
  ): Promise<CoordinatorCollegeDepartmentEntity> {
    return await this.coordinatorCollegeDepartmentRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<CoordinatorCollegeDepartmentEntity>,
    relations?: FindRelationsOptions<CoordinatorCollegeDepartmentEntity>,
    findManyOptions?: FindManyOptions<CoordinatorCollegeDepartmentEntity>,
  ): Promise<CoordinatorCollegeDepartmentEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.coordinatorCollegeDepartmentRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<CoordinatorCollegeDepartmentEntity>,
    data: UpdateOptions<CoordinatorCollegeDepartmentEntity>,
  ) {
    return await this.coordinatorCollegeDepartmentRepository.update(
      where,
      data,
    );
  }

  public async delete(
    where: FindOneWhereOptions<CoordinatorCollegeDepartmentEntity>,
  ) {
    const coordinatorCollegeDepartment =
      await this.coordinatorCollegeDepartmentRepository.findOne({
        where,
      });

    await this.coordinatorCollegeDepartmentRepository.softRemove(
      coordinatorCollegeDepartment,
    );
  }
}
