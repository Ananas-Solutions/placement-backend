import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseTrainingSiteEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class CourseTrainingSiteRepositoryService {
  constructor(
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSiteRepository: Repository<CourseTrainingSiteEntity>,
  ) {}

  public async save(
    data: SaveOptions<CourseTrainingSiteEntity>,
  ): Promise<CourseTrainingSiteEntity> {
    return await this.courseTrainingSiteRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<CourseTrainingSiteEntity>,
    relations?: FindRelationsOptions<CourseTrainingSiteEntity>,
  ): Promise<CourseTrainingSiteEntity> {
    return await this.courseTrainingSiteRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<CourseTrainingSiteEntity>,
    relations?: FindRelationsOptions<CourseTrainingSiteEntity>,
    findManyOptions?: FindManyOptions<CourseTrainingSiteEntity>,
  ): Promise<CourseTrainingSiteEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.courseTrainingSiteRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<CourseTrainingSiteEntity>,
    data: UpdateOptions<CourseTrainingSiteEntity>,
  ) {
    return await this.courseTrainingSiteRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<CourseTrainingSiteEntity>,
    relations?: FindRelationsOptions<CourseTrainingSiteEntity>,
  ) {
    const courseTrainingSite = await this.courseTrainingSiteRepository.findOne({
      where,
      relations,
    });

    await this.courseTrainingSiteRepository.softRemove(courseTrainingSite);
  }
}
