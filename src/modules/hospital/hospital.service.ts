import { ConflictException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { HospitalEntity } from 'entities/hospital.entity';
import { AuthorityEntity } from 'entities/authority.entity';
import { HospitalRepositoryService } from 'repository/services';

import { HospitalDto } from './dto/';
import { IHospitalDetailResponse, IHospitalResponse } from './response';

@Injectable()
export class HospitalService {
  constructor(private readonly hospitalRepository: HospitalRepositoryService) {}

  async saveHospital(bodyDto: HospitalDto): Promise<IHospitalResponse> {
    const { authorityId, name, location, contactEmail } = bodyDto;
    const existingHospital = await this.hospitalRepository.findOne({
      location,
    });
    if (existingHospital) {
      throw new ConflictException(
        'Hospital with the same address already exists.',
      );
    }

    const hospital = await this.hospitalRepository.save({
      name,
      location,
      contactEmail,
      authority: { id: authorityId } as AuthorityEntity,
    });

    return this.transformToResponse(hospital);
  }

  async getAllHospital(): Promise<IHospitalDetailResponse[]> {
    const allHospitals = await this.hospitalRepository.findMany(
      {},
      {
        authority: true,
      },
    );

    return allHospitals.map((hospital) =>
      this.transformToDetailResponse(hospital),
    );
  }

  async findAllHospital(authorityIds: string[]): Promise<IHospitalResponse[]> {
    const authorityAllHospitals = await this.hospitalRepository.findMany({
      authority: { id: In(authorityIds) },
    });
    return authorityAllHospitals.map((hospital) =>
      this.transformToResponse(hospital),
    );
  }

  async findOneHospital(id: string): Promise<IHospitalDetailResponse> {
    const hospital = await this.hospitalRepository.findOne(
      {
        id,
      },
      { authority: true, departments: true },
    );
    return this.transformToDetailResponse(hospital);
  }

  async updateOneHospital(
    hospitalId: string,
    bodyDto: HospitalDto,
  ): Promise<IHospitalResponse> {
    const { authorityId, name, location, contactEmail } = bodyDto;
    await this.hospitalRepository.update(
      { id: hospitalId },
      {
        name,
        location,
        contactEmail,
        authority: { id: authorityId } as AuthorityEntity,
      },
    );

    const updatedHospital = await this.hospitalRepository.findOne({
      id: hospitalId,
    });

    return this.transformToResponse(updatedHospital);
  }

  async deleteOneHospital(id: string): Promise<ISuccessMessageResponse> {
    await this.hospitalRepository.delete(
      { id },
      { departments: { departmentUnits: true } },
    );

    return { message: 'Hospital deleted successfully' };
  }

  private transformToResponse(hospital: HospitalEntity): IHospitalResponse {
    const { id, name, location, contactEmail } = hospital;
    return {
      id,
      name,
      location,
      contactEmail,
    };
  }

  private transformToDetailResponse(
    hospital: HospitalEntity,
  ): IHospitalDetailResponse {
    const { id, name, location, authority, contactEmail, departments } =
      hospital;

    const mappedDepartments = departments?.map((d) => ({
      id: d.id,
      name: d.name,
      contactEmail: d.contactEmail,
    }));

    return {
      id,
      name,
      location,
      contactEmail,
      authority: {
        id: authority.id,
        name: authority.name,
        initials: authority.initials,
        contactEmail: authority.contactEmail,
      },
      departments: mappedDepartments,
    };
  }
}
