import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentEvaluationEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class StudentEvaluationRepositoryService {
  constructor(
    @InjectRepository(StudentEvaluationEntity)
    private readonly studentEvaluationRepository: Repository<StudentEvaluationEntity>,
  ) {}

  public async save(
    data: SaveOptions<StudentEvaluationEntity>,
  ): Promise<StudentEvaluationEntity> {
    return await this.studentEvaluationRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<StudentEvaluationEntity>,
    relations?: FindRelationsOptions<StudentEvaluationEntity>,
  ): Promise<StudentEvaluationEntity> {
    return await this.studentEvaluationRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<StudentEvaluationEntity>,
    relations?: FindRelationsOptions<StudentEvaluationEntity>,
    findManyOptions?: FindManyOptions<StudentEvaluationEntity>,
  ): Promise<StudentEvaluationEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.studentEvaluationRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<StudentEvaluationEntity>,
    data: UpdateOptions<StudentEvaluationEntity>,
  ) {
    return await this.studentEvaluationRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<StudentEvaluationEntity>) {
    const studentEvaluation = await this.studentEvaluationRepository.findOne({
      where,
    });

    await this.studentEvaluationRepository.softRemove(studentEvaluation);
  }
}
