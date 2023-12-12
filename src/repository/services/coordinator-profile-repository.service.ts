import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoordinatorProfileEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class CoordinatorProfileRepositoryService {
  constructor(
    @InjectRepository(CoordinatorProfileEntity)
    private readonly coordinatorProfileRepository: Repository<CoordinatorProfileEntity>,
  ) {}

  public async save(
    data: SaveOptions<CoordinatorProfileEntity>,
  ): Promise<CoordinatorProfileEntity> {
    return await this.coordinatorProfileRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<CoordinatorProfileEntity>,
    relations?: FindRelationsOptions<CoordinatorProfileEntity>,
  ): Promise<CoordinatorProfileEntity> {
    return await this.coordinatorProfileRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<CoordinatorProfileEntity>,
    relations?: FindRelationsOptions<CoordinatorProfileEntity>,
    findManyOptions?: FindManyOptions<CoordinatorProfileEntity>,
  ): Promise<CoordinatorProfileEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.coordinatorProfileRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<CoordinatorProfileEntity>,
    data: UpdateOptions<CoordinatorProfileEntity>,
  ) {
    return await this.coordinatorProfileRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<CoordinatorProfileEntity>,
    relations?: FindRelationsOptions<CoordinatorProfileEntity>,
  ) {
    const coordinatorProfile = await this.coordinatorProfileRepository.findOne({
      where,
      relations,
    });

    await this.coordinatorProfileRepository.softRemove(coordinatorProfile);
  }
}
