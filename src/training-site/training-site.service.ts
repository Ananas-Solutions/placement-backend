import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingSite } from './entity/training-site.entity';

@Injectable()
export class TrainingSiteService {
  constructor(
    @InjectRepository(TrainingSite)
    private readonly trainingSiteRepository: Repository<TrainingSite>,
  ) {}

  async findOne(id: string): Promise<any> {
    try {
      return await this.trainingSiteRepository.findOne(id);
    } catch (err) {
      throw err;
    }
  }
}
