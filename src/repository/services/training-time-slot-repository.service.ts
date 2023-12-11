import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingTimeSlotEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class TrainingTimeSlotRepositoryService {
  constructor(
    @InjectRepository(TrainingTimeSlotEntity)
    private readonly trainingTimeSlotRepository: Repository<TrainingTimeSlotEntity>,
  ) {}

  public async save(
    data: SaveOptions<TrainingTimeSlotEntity>,
  ): Promise<TrainingTimeSlotEntity> {
    return await this.trainingTimeSlotRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<TrainingTimeSlotEntity>,
    relations?: FindRelationsOptions<TrainingTimeSlotEntity>,
  ): Promise<TrainingTimeSlotEntity> {
    return await this.trainingTimeSlotRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<TrainingTimeSlotEntity>,
    relations?: FindRelationsOptions<TrainingTimeSlotEntity>,
    findManyOptions?: FindManyOptions<TrainingTimeSlotEntity>,
  ): Promise<TrainingTimeSlotEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.trainingTimeSlotRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<TrainingTimeSlotEntity>,
    data: UpdateOptions<TrainingTimeSlotEntity>,
  ) {
    return await this.trainingTimeSlotRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<TrainingTimeSlotEntity>) {
    const trainingSlotTime = await this.trainingTimeSlotRepository.findOne({
      where,
    });

    await this.trainingTimeSlotRepository.softRemove(trainingSlotTime);
  }
}
