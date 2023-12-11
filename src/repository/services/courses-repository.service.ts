import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class CoursesRepositoryService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  public async save(data: SaveOptions<CourseEntity>): Promise<CourseEntity> {
    return await this.courseRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<CourseEntity>,
    relations?: FindRelationsOptions<CourseEntity>,
  ): Promise<CourseEntity> {
    return await this.courseRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<CourseEntity>,
    relations?: FindRelationsOptions<CourseEntity>,
    findManyOptions?: FindManyOptions<CourseEntity>,
  ): Promise<CourseEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.courseRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<CourseEntity>,
    data: UpdateOptions<CourseEntity>,
  ) {
    return await this.courseRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<CourseEntity>) {
    const course = await this.courseRepository.findOne({
      where,
    });

    await this.courseRepository.softRemove(course);
  }
}
