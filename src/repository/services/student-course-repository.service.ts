import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentCourseEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class StudentCourseRepositoryService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
  ) {}

  public async save(
    data: SaveOptions<StudentCourseEntity>,
  ): Promise<StudentCourseEntity> {
    return await this.studentCourseRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<StudentCourseEntity>,
    relations?: FindRelationsOptions<StudentCourseEntity>,
  ): Promise<StudentCourseEntity> {
    return await this.studentCourseRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<StudentCourseEntity>,
    relations?: FindRelationsOptions<StudentCourseEntity>,
    findManyOptions?: FindManyOptions<StudentCourseEntity>,
  ): Promise<StudentCourseEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.studentCourseRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<StudentCourseEntity>,
    data: UpdateOptions<StudentCourseEntity>,
  ) {
    return await this.studentCourseRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<StudentCourseEntity>,
    relations?: FindRelationsOptions<StudentCourseEntity>,
  ) {
    const studentEvaluation = await this.studentCourseRepository.findOne({
      where,
      relations,
    });

    await this.studentCourseRepository.softRemove(studentEvaluation);
  }
}
