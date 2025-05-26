import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';

import { DataResponse, SuccessMessageResponse } from 'commons/response';
import { HospitalEntity } from 'entities/hospital.entity';
import { AuthorityEntity } from 'entities/authority.entity';

import { HospitalDto, QueryAuthorityHospitalDto } from './dto/';
import {
  CreateHospitalResponse,
  HospitalDetailResponse,
  HospitalResponse,
} from './response';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async saveHospital(bodyDto: HospitalDto): Promise<CreateHospitalResponse> {
    const { authorityId, name, location, contactEmail } = bodyDto;
    const existingHospital = await this.hospitalRepository.findOne({
      where: { location },
      loadEagerRelations: false,
    });
    if (existingHospital) {
      throw new ConflictException(
        'Hospital with the same address already exists.',
      );
    }

    const newHospital = this.hospitalRepository.create({
      name,
      location,
      contactEmail,
      authority: { id: authorityId } as AuthorityEntity,
    });
    const hospital = await this.hospitalRepository.save(newHospital);

    return {
      message: 'Hospital created successfully',
      data: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        contactEmail: hospital.contactEmail,
      },
    };
  }

  async getAllHospital(
    query: SearchQueryDto,
  ): Promise<DataResponse<HospitalDetailResponse[]>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<HospitalEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allHospitals, totalItems] =
      await this.hospitalRepository.findAndCount({
        where,
        relations: ['authority'],
        loadEagerRelations: false,
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allHospitals.map((hospital) =>
        this.transformToDetailResponse(hospital),
      ),
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async findAllHospital(
    query: QueryAuthorityHospitalDto,
  ): Promise<DataResponse<HospitalEntity[]>> {
    const { page, limit, search, authorityIds } = query;
    const authorityIdsArray = authorityIds.split(' ');
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<HospitalEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (authorityIdsArray.length > 0) {
      where.authority = { id: In(authorityIdsArray) };
    }

    const [authorityAllHospitals, totalItems] =
      await this.hospitalRepository.findAndCount({
        where,
        loadEagerRelations: false,
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: authorityAllHospitals,
      metadata: {
        ...query,
        totalItems: totalItems,
      },
    };
  }

  async findOneHospital(id: string): Promise<{ data: HospitalDetailResponse }> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: ['authority', 'departments'],
    });
    return { data: this.transformToDetailResponse(hospital) };
  }

  async updateOneHospital(
    hospitalId: string,
    bodyDto: HospitalDto,
  ): Promise<{ data: HospitalResponse }> {
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
      where: { id: hospitalId },
      loadEagerRelations: false,
    });

    return { data: this.transformToResponse(updatedHospital) };
  }

  async deleteOneHospital(id: string): Promise<SuccessMessageResponse> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    await this.hospitalRepository.softRemove(hospital);

    return { message: 'Hospital deleted successfully' };
  }

  private transformToResponse(hospital: HospitalEntity): HospitalResponse {
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
  ): HospitalDetailResponse {
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
