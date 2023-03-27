import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { HospitalEntity } from 'entities/hospital.entity';
import { AuthorityEntity } from 'entities/authority.entity';

import { HospitalDto } from './dto/';
import { IHospitalDetailResponse, IHospitalResponse } from './response';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async saveHospital(bodyDto: HospitalDto): Promise<IHospitalResponse> {
    const { authorityId, name, location } = bodyDto;
    const newHospital = this.hospitalRepository.create({
      name,
      location,
      authority: { id: authorityId } as AuthorityEntity,
    });
    const hospital = await this.hospitalRepository.save(newHospital);

    return this.transformToResponse(hospital);
  }

  async getAllHospital(): Promise<IHospitalDetailResponse[]> {
    const allHospitals = await this.hospitalRepository.find({
      relations: ['authority'],
    });
    return allHospitals.map((hospital) =>
      this.transformToDetailResponse(hospital),
    );
  }

  async findAllHospital(authorityId: string): Promise<IHospitalResponse[]> {
    const authorityAllHospitals = await this.hospitalRepository.find({
      where: { authority: { id: authorityId } },
    });
    return authorityAllHospitals.map((hospital) =>
      this.transformToResponse(hospital),
    );
  }

  async findOneHospital(id: string): Promise<IHospitalDetailResponse> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id },
      relations: ['authority', 'departments'],
    });
    return this.transformToDetailResponse(hospital);
  }

  async updateOneHospital(
    hospitalId: string,
    bodyDto: HospitalDto,
  ): Promise<IHospitalResponse> {
    const { authorityId, name, location } = bodyDto;
    await this.hospitalRepository.update(
      { id: hospitalId },
      {
        name,
        location,
        authority: { id: authorityId } as AuthorityEntity,
      },
    );

    const updatedHospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });

    return this.transformToResponse(updatedHospital);
  }

  async deleteOneHospital(id: string): Promise<ISuccessMessageResponse> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    await this.hospitalRepository.softRemove(hospital);

    return { message: 'Hospital deleted successfully' };
  }

  private transformToResponse(hospital: HospitalEntity): IHospitalResponse {
    const { id, name, location } = hospital;
    return {
      id,
      name,
      location,
    };
  }

  private transformToDetailResponse(
    hospital: HospitalEntity,
  ): IHospitalDetailResponse {
    const { id, name, location, authority, departments } = hospital;

    const mappedDepartments = departments?.map((d) => ({
      id: d.id,
      name: d.name,
    }));

    return {
      id,
      name,
      location,
      authority: {
        id: authority.id,
        name: authority.name,
        initials: authority.initials,
      },
      departments: mappedDepartments,
    };
  }
}