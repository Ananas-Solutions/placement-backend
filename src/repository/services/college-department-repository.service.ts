import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CollegeDepartmentEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class CollegeDepartmentRepositoryService {
  constructor(
    @InjectRepository(CollegeDepartmentEntity)
    private readonly collegeDepartmentRepository: Repository<CollegeDepartmentEntity>,
  ) {}

  public async save(
    data: SaveOptions<CollegeDepartmentEntity>,
  ): Promise<CollegeDepartmentEntity> {
    return await this.collegeDepartmentRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<CollegeDepartmentEntity>,
    relations?: FindRelationsOptions<CollegeDepartmentEntity>,
  ): Promise<CollegeDepartmentEntity> {
    return await this.collegeDepartmentRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<CollegeDepartmentEntity>,
    relations?: FindRelationsOptions<CollegeDepartmentEntity>,
    findManyOptions?: FindManyOptions<CollegeDepartmentEntity>,
  ): Promise<CollegeDepartmentEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.collegeDepartmentRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<CollegeDepartmentEntity>,
    data: UpdateOptions<CollegeDepartmentEntity>,
  ) {
    return await this.collegeDepartmentRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<CollegeDepartmentEntity>) {
    const collegeDepartment = await this.collegeDepartmentRepository.findOne({
      where,
    });

    await this.collegeDepartmentRepository.softRemove(collegeDepartment);
  }
}
