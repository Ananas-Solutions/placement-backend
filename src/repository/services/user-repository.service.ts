import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'entities/index.entity';
import {
  CreateOptions,
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async create(data: CreateOptions<UserEntity>) {
    return this.userRepository.create(data);
  }

  public async save(data: SaveOptions<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<UserEntity>,
    relations?: FindRelationsOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<UserEntity>,
    relations?: FindRelationsOptions<UserEntity>,
    findManyOptions?: FindManyOptions<UserEntity>,
  ): Promise<UserEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.userRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<UserEntity>,
    data: UpdateOptions<UserEntity>,
  ) {
    return await this.userRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<UserEntity>,
    relations?: FindRelationsOptions<UserEntity>,
  ) {
    const user = await this.userRepository.findOne({
      where,
      relations,
    });

    await this.userRepository.softRemove(user);
  }
}
