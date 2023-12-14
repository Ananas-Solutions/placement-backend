import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentProfileEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
  UpsertOptions,
} from 'repository/type-def';

@Injectable()
export class StudentProfileRepositoryService {
  constructor(
    @InjectRepository(StudentProfileEntity)
    private readonly studentProfileRepository: Repository<StudentProfileEntity>,
  ) {}

  public async save(
    data: SaveOptions<StudentProfileEntity>,
  ): Promise<StudentProfileEntity> {
    return await this.studentProfileRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<StudentProfileEntity>,
    relations?: FindRelationsOptions<StudentProfileEntity>,
  ): Promise<StudentProfileEntity> {
    return await this.studentProfileRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<StudentProfileEntity>,
    relations?: FindRelationsOptions<StudentProfileEntity>,
    findManyOptions?: FindManyOptions<StudentProfileEntity>,
  ): Promise<StudentProfileEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.studentProfileRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async upsert(
    data: UpdateOptions<StudentProfileEntity>,
    upsertOptions: UpsertOptions<StudentProfileEntity>,
  ) {
    return await this.studentProfileRepository.upsert(data, upsertOptions);
  }

  public async update(
    where: FindOneWhereOptions<StudentProfileEntity>,
    data: UpdateOptions<StudentProfileEntity>,
  ) {
    return await this.studentProfileRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<StudentProfileEntity>,
    relations?: FindRelationsOptions<StudentProfileEntity>,
  ) {
    const studentProfile = await this.studentProfileRepository.findOne({
      where,
      relations,
    });

    await this.studentProfileRepository.softRemove(studentProfile);
  }
}
