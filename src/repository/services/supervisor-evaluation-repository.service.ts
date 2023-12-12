import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupervisorEvaluationEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class SupervisorEvaluationRepositoryService {
  constructor(
    @InjectRepository(SupervisorEvaluationEntity)
    private readonly supervisorEvaluationRepository: Repository<SupervisorEvaluationEntity>,
  ) {}

  public async save(
    data: SaveOptions<SupervisorEvaluationEntity>,
  ): Promise<SupervisorEvaluationEntity> {
    return await this.supervisorEvaluationRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<SupervisorEvaluationEntity>,
    relations?: FindRelationsOptions<SupervisorEvaluationEntity>,
  ): Promise<SupervisorEvaluationEntity> {
    return await this.supervisorEvaluationRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<SupervisorEvaluationEntity>,
    relations?: FindRelationsOptions<SupervisorEvaluationEntity>,
    findManyOptions?: FindManyOptions<SupervisorEvaluationEntity>,
  ): Promise<SupervisorEvaluationEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.supervisorEvaluationRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<SupervisorEvaluationEntity>,
    data: UpdateOptions<SupervisorEvaluationEntity>,
  ) {
    return await this.supervisorEvaluationRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<SupervisorEvaluationEntity>,
    relations?: FindRelationsOptions<SupervisorEvaluationEntity>,
  ) {
    const supervisorEvaluation =
      await this.supervisorEvaluationRepository.findOne({
        where,
        relations,
      });

    await this.supervisorEvaluationRepository.softRemove(supervisorEvaluation);
  }
}
