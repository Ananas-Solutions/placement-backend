import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorityService } from 'src/authority/authority.service';
import { Authority } from 'src/authority/entity/authority.entity';
import { Repository } from 'typeorm';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from './entity/hospital.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  async saveHospital(bodyDto: CreateHospitalDto): Promise<Hospital> {
    try {
      const { authorityId, ...body } = bodyDto;
      const newHospital = this.hospitalRepository.create({
        ...body,
        authority: { id: authorityId } as Authority,
      });
      const hospital = await this.hospitalRepository.save(newHospital);
      delete hospital.authority;
      return hospital;
    } catch (err) {
      throw err;
    }
  }

  async getAllHospital(): Promise<Hospital[]> {
    try {
      return await this.hospitalRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async findAllHospital(authorityId: string): Promise<Hospital[]> {
    try {
      return await this.hospitalRepository.find({
        where: { authority: authorityId },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneHospital(id: string): Promise<Hospital> {
    try {
      return await this.hospitalRepository.findOne({
        where: { id },
        relations: ['authority', 'department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateOneHospital(bodyDto: UpdateHospitalDto): Promise<any> {
    try {
      const { authorityId, ...body } = bodyDto;
      return await this.hospitalRepository.update(
        { id: bodyDto.id },
        {
          ...body,
          authority: { id: authorityId } as Authority,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteOneHospital(id: string): Promise<any> {
    try {
      return await this.hospitalRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
