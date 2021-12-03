import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorityService } from 'src/authority/authority.service';
import { Repository } from 'typeorm';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from './entity/hospital.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
    private readonly authorityService: AuthorityService,
  ) {}

  async saveHospital(body: CreateHospitalDto): Promise<Hospital> {
    try {
      const authority = await this.authorityService.findOneAuthority(
        body.authority,
      );
      if (!authority) throw new NotFoundException('Authority not found');
      const newHospital = this.hospitalRepository.create({
        ...body,
        authority,
      });
      const hospital = await this.hospitalRepository.save(newHospital);
      delete hospital.authority;
      return hospital;
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
        relations: ['department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateOneHospital(body: UpdateHospitalDto): Promise<Hospital> {
    try {
      const authority = await this.authorityService.findOneAuthority(
        body.authority,
      );
      if (!authority) throw new NotFoundException('Authority not found');
      const hospital = await this.hospitalRepository.findOne(body.id);
      if (!hospital) throw new NotFoundException('Hospital not found');
      return await this.hospitalRepository.save({
        ...hospital,
        ...body,
        authority,
      });
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
