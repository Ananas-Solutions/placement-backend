import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class NotificationRepositoryService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  public async save(
    data: SaveOptions<NotificationEntity>,
  ): Promise<NotificationEntity> {
    return await this.notificationRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<NotificationEntity>,
    relations?: FindRelationsOptions<NotificationEntity>,
  ): Promise<NotificationEntity> {
    return await this.notificationRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<NotificationEntity>,
    relations?: FindRelationsOptions<NotificationEntity>,
    findManyOptions?: FindManyOptions<NotificationEntity>,
  ): Promise<NotificationEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.notificationRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<NotificationEntity>,
    data: UpdateOptions<NotificationEntity>,
  ) {
    return await this.notificationRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<NotificationEntity>) {
    const notification = await this.notificationRepository.findOne({
      where,
    });

    await this.notificationRepository.softRemove(notification);
  }
}
