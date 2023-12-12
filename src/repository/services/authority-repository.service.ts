import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthorityEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class AuthorityRepositoryService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private readonly authorityRepository: Repository<AuthorityEntity>,
  ) {}

  public async save(
    data: SaveOptions<AuthorityEntity>,
  ): Promise<AuthorityEntity> {
    return await this.authorityRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<AuthorityEntity>,
    relations?: FindRelationsOptions<AuthorityEntity>,
  ): Promise<AuthorityEntity> {
    return await this.authorityRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<AuthorityEntity>,
    relations?: FindRelationsOptions<AuthorityEntity>,
    findManyOptions?: FindManyOptions<AuthorityEntity>,
  ): Promise<AuthorityEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.authorityRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<AuthorityEntity>,
    data: UpdateOptions<AuthorityEntity>,
  ) {
    return await this.authorityRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<AuthorityEntity>,
    relations?: FindRelationsOptions<AuthorityEntity>,
  ) {
    const authority = await this.authorityRepository.findOne({
      where,
      relations,
    });

    await this.authorityRepository.softRemove(authority);
  }
}
