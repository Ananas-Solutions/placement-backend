import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlacementEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class PlacementRepositoryService {
  constructor(
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
  ) {}

  public async save(
    data: SaveOptions<PlacementEntity>,
  ): Promise<PlacementEntity> {
    return await this.placementRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<PlacementEntity>,
    relations?: FindRelationsOptions<PlacementEntity>,
  ): Promise<PlacementEntity> {
    return await this.placementRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<PlacementEntity>,
    relations?: FindRelationsOptions<PlacementEntity>,
    findManyOptions?: FindManyOptions<PlacementEntity>,
  ): Promise<PlacementEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.placementRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<PlacementEntity>,
    data: UpdateOptions<PlacementEntity>,
  ) {
    return await this.placementRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<PlacementEntity>) {
    const placement = await this.placementRepository.findOne({
      where,
    });

    await this.placementRepository.softRemove(placement);
  }
}
