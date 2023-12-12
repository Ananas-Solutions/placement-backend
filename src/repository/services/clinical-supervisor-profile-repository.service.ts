import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupervisorProfileEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class ClinicalSupervisorProfileRepositoryService {
  constructor(
    @InjectRepository(SupervisorProfileEntity)
    private readonly supervisorProfileRepository: Repository<SupervisorProfileEntity>,
  ) {}

  public async save(
    data: SaveOptions<SupervisorProfileEntity>,
  ): Promise<SupervisorProfileEntity> {
    return await this.supervisorProfileRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<SupervisorProfileEntity>,
    relations?: FindRelationsOptions<SupervisorProfileEntity>,
  ): Promise<SupervisorProfileEntity> {
    return await this.supervisorProfileRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<SupervisorProfileEntity>,
    relations?: FindRelationsOptions<SupervisorProfileEntity>,
    findManyOptions?: FindManyOptions<SupervisorProfileEntity>,
  ): Promise<SupervisorProfileEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.supervisorProfileRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<SupervisorProfileEntity>,
    data: UpdateOptions<SupervisorProfileEntity>,
  ) {
    return await this.supervisorProfileRepository.update(where, data);
  }

  public async delete(
    where: FindOneWhereOptions<SupervisorProfileEntity>,
    relations?: FindRelationsOptions<SupervisorProfileEntity>,
  ) {
    const supervisorProfile = await this.supervisorProfileRepository.findOne({
      where,
      relations,
    });

    await this.supervisorProfileRepository.softRemove(supervisorProfile);
  }
}
