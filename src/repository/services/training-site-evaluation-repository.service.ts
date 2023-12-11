import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingSiteEvaluationEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class TrainingSiteEvaluationRepositoryService {
  constructor(
    @InjectRepository(TrainingSiteEvaluationEntity)
    private readonly trainingSiteEvaluationRepository: Repository<TrainingSiteEvaluationEntity>,
  ) {}

  public async save(
    data: SaveOptions<TrainingSiteEvaluationEntity>,
  ): Promise<TrainingSiteEvaluationEntity> {
    return await this.trainingSiteEvaluationRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<TrainingSiteEvaluationEntity>,
    relations?: FindRelationsOptions<TrainingSiteEvaluationEntity>,
  ): Promise<TrainingSiteEvaluationEntity> {
    return await this.trainingSiteEvaluationRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<TrainingSiteEvaluationEntity>,
    relations?: FindRelationsOptions<TrainingSiteEvaluationEntity>,
    findManyOptions?: FindManyOptions<TrainingSiteEvaluationEntity>,
  ): Promise<TrainingSiteEvaluationEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.trainingSiteEvaluationRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<TrainingSiteEvaluationEntity>,
    data: UpdateOptions<TrainingSiteEvaluationEntity>,
  ) {
    return await this.trainingSiteEvaluationRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<TrainingSiteEvaluationEntity>,
  ) {
    const trainingSiteEvaluation =
      await this.trainingSiteEvaluationRepository.findOne({
        where,
      });

    await this.trainingSiteEvaluationRepository.softRemove(
      trainingSiteEvaluation,
    );
  }
}
