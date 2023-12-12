import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class EventRepositoryService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  public async save(data: SaveOptions<EventEntity>): Promise<EventEntity> {
    return await this.eventRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<EventEntity>,
    relations?: FindRelationsOptions<EventEntity>,
  ): Promise<EventEntity> {
    return await this.eventRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<EventEntity>,
    relations?: FindRelationsOptions<EventEntity>,
    findManyOptions?: FindManyOptions<EventEntity>,
  ): Promise<EventEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.eventRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<EventEntity>,
    data: UpdateOptions<EventEntity>,
  ) {
    return await this.eventRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<EventEntity>,
    relations?: FindRelationsOptions<EventEntity>,
  ) {
    const event = await this.eventRepository.findOne({
      where,
      relations,
    });

    await this.eventRepository.softRemove(event);
  }
}
