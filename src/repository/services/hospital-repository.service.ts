import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HospitalEntity } from 'entities/index.entity';
import {
  FindManyOptions,
  FindOneWhereOptions,
  FindRelationsOptions,
  SaveOptions,
  UpdateOptions,
} from 'repository/type-def';

@Injectable()
export class HospitalRepositoryService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
  ) {}

  public async save(
    data: SaveOptions<HospitalEntity>,
  ): Promise<HospitalEntity> {
    return await this.hospitalRepository.save(data);
  }

  public async findOne(
    where: FindOneWhereOptions<HospitalEntity>,
    relations?: FindRelationsOptions<HospitalEntity>,
  ): Promise<HospitalEntity> {
    return await this.hospitalRepository.findOne({
      where,
      relations,
    });
  }

  public async findMany(
    where?: FindOneWhereOptions<HospitalEntity>,
    relations?: FindRelationsOptions<HospitalEntity>,
    findManyOptions?: FindManyOptions<HospitalEntity>,
  ): Promise<HospitalEntity[]> {
    const skip = findManyOptions?.skip ?? 0;
    const take = findManyOptions?.take ?? 10;

    return await this.hospitalRepository.find({
      where,
      relations,
      skip,
      take,
    });
  }

  public async update(
    where: FindOneWhereOptions<HospitalEntity>,
    data: UpdateOptions<HospitalEntity>,
  ) {
    return await this.hospitalRepository.update(where, data);
  }

  public async delete(where: FindOneWhereOptions<HospitalEntity>) {
    const hospital = await this.hospitalRepository.findOne({
      where,
    });

    await this.hospitalRepository.softRemove(hospital);
  }
}
