import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserDocumentEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class UserDocumentRepositoryService {
  constructor(
    @InjectRepository(UserDocumentEntity)
    private readonly userDocumentRepository: Repository<UserDocumentEntity>,
  ) {}

  public async save(
    data: SaveOptions<UserDocumentEntity>,
  ): Promise<UserDocumentEntity> {
    return await this.userDocumentRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<UserDocumentEntity>,
    relations?: FindRelationsOptions<UserDocumentEntity>,
  ): Promise<UserDocumentEntity> {
    return await this.userDocumentRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<UserDocumentEntity>,
    relations?: FindRelationsOptions<UserDocumentEntity>,
    findManyOptions?: FindManyOptions<UserDocumentEntity>,
  ): Promise<UserDocumentEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.userDocumentRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<UserDocumentEntity>,
    data: UpdateOptions<UserDocumentEntity>,
  ) {
    return await this.userDocumentRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<UserDocumentEntity>,
    relations?: FindRelationsOptions<UserDocumentEntity>,
  ) {
    const userDocument = await this.userDocumentRepository.findOne({
      where,
      relations,
    });

    await this.userDocumentRepository.softRemove(userDocument);
  }
}
