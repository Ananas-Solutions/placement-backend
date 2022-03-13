import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Authority } from 'src/authority/entity/authority.entity';
import { Department } from 'src/department/entity/department.entity';
import { Hospital } from 'src/hospital/entity/hospital.entity';
import { Repository } from 'typeorm';
import { CreateTrainingSiteDto } from './dto/training-site.dto';
import { TrainingSite } from './entity/training-site.entity';

@Injectable()
export class TrainingSiteService {
  constructor(
    @InjectRepository(TrainingSite)
    private readonly trainingSiteRepository: Repository<TrainingSite>,
  ) {}

  async create(body: CreateTrainingSiteDto): Promise<TrainingSite> {
    try {
      const { authorityId, hospitalId, departmentId, ...rest } = body;
      return await this.trainingSiteRepository.save({
        ...rest,
        authority: { id: authorityId } as Authority,
        hospital: { id: hospitalId } as Hospital,
        department: { id: departmentId } as Department,
      });
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.trainingSiteRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.findOne(id, {
        relations: ['authority', 'hospital', 'department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, body: CreateTrainingSiteDto): Promise<any> {
    try {
      const { authorityId, hospitalId, departmentId, ...rest } = body;
      await this.trainingSiteRepository.update(
        { id },
        {
          ...rest,
          authority: { id: authorityId } as Authority,
          hospital: { id: hospitalId } as Hospital,
          department: { id: departmentId } as Department,
        },
      );
      return await this.trainingSiteRepository.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
