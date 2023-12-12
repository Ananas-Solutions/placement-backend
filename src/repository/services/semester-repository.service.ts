import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SemesterEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class SemesterRepositoryService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepository: Repository<SemesterEntity>,
  ) {}

  public async save(
    data: SaveOptions<SemesterEntity>,
  ): Promise<SemesterEntity> {
    return await this.semesterRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<SemesterEntity>,
    relations?: FindRelationsOptions<SemesterEntity>,
  ): Promise<SemesterEntity> {
    return await this.semesterRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<SemesterEntity>,
    relations?: FindRelationsOptions<SemesterEntity>,
    findManyOptions?: FindManyOptions<SemesterEntity>,
  ): Promise<SemesterEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.semesterRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<SemesterEntity>,
    data: UpdateOptions<SemesterEntity>,
  ) {
    return await this.semesterRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<SemesterEntity>,
    relations?: FindRelationsOptions<SemesterEntity>,
  ) {
    const semester = await this.semesterRepository.findOne({
      where,
      relations,
    });

    await this.semesterRepository.softRemove(semester);
  }
}
