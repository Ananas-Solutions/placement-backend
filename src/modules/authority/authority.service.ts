import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { AuthorityEntity } from 'entities/authority.entity';

import { AuthorityDto } from './dto';
import { IAuthorityResponse } from './response/authority.response';
import { ISingleAuthorityResponse } from './response/single-authority.response';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private authorityRepository: Repository<AuthorityEntity>,
  ) {}

  async saveAuthority(body: AuthorityDto): Promise<IAuthorityResponse> {
    const newAuthority = await this.authorityRepository.save(body);
    return this.transformToResponse(newAuthority);
  }

  async findAllAuthority(): Promise<IAuthorityResponse[]> {
    const allAuthorities = await this.authorityRepository.find();
    return allAuthorities.map((authority) =>
      this.transformToResponse(authority),
    );
  }

  async findOneAuthority(id: string): Promise<IAuthorityResponse> {
    const authority = await this.authorityRepository.findOne({
      where: { id },
      relations: ['hospitals'],
    });

    return this.transformToSingleResponse(authority);
  }

  async updateOneAuthority(
    authorityId: string,
    body: AuthorityDto,
  ): Promise<IAuthorityResponse> {
    await this.authorityRepository.update({ id: authorityId }, body);
    const authority = await this.authorityRepository.findOne({
      where: { id: authorityId },
    });

    return this.transformToResponse(authority);
  }

  async deleteOneAuthority(id: string): Promise<ISuccessMessageResponse> {
    const authority = await this.authorityRepository.findOne({ where: { id } });
    await this.authorityRepository.softRemove(authority);
    return { message: 'Authority deleted successfully' };
  }

  private transformToResponse(authority: AuthorityEntity): IAuthorityResponse {
    const { id, name, initials } = authority;
    return { id, name, initials };
  }

  private transformToSingleResponse(
    authority: AuthorityEntity,
  ): ISingleAuthorityResponse {
    const { id, name, initials, hospitals } = authority;

    const mappedHospitals = hospitals?.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      location: hospital.location,
    }));

    return {
      id,
      name,
      initials,
      hospitals: mappedHospitals,
    };
  }
}
