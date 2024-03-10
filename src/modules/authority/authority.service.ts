import { ConflictException, Injectable } from '@nestjs/common';
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
    const existingAuthority = await this.authorityRepository.findOne({
      where: { name: body.name },
    });
    if (existingAuthority) {
      throw new ConflictException(
        'Authority with the same name already exists in the system.',
      );
    }

    const newAuthority = await this.authorityRepository.save(body);
    return this.transformToResponse(newAuthority);
  }

  async findAllAuthority(): Promise<IAuthorityResponse[]> {
    const allAuthorities = await this.authorityRepository.find({
      loadEagerRelations: false,
      order: {
        name: 'asc',
      },
    });
    return allAuthorities.map((authority) =>
      this.transformToResponse(authority),
    );
  }

  async findOneAuthority(id: string): Promise<IAuthorityResponse> {
    const authority = await this.authorityRepository.findOne({
      where: { id },
      loadEagerRelations: false,
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
      loadEagerRelations: false,
    });

    return this.transformToResponse(authority);
  }

  async deleteOneAuthority(id: string): Promise<ISuccessMessageResponse> {
    const authority = await this.authorityRepository.findOne({
      where: { id },
    });
    await this.authorityRepository.softRemove(authority);
    return { message: 'Authority deleted successfully' };
  }

  private transformToResponse(authority: AuthorityEntity): IAuthorityResponse {
    const { id, name, initials, contactEmail } = authority;
    return { id, name, initials, contactEmail };
  }

  private transformToSingleResponse(
    authority: AuthorityEntity,
  ): ISingleAuthorityResponse {
    const { id, name, initials, contactEmail, hospitals } = authority;

    const mappedHospitals = hospitals?.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      location: hospital.location,
      contactEmail: hospital.contactEmail,
    }));

    return {
      id,
      name,
      contactEmail,
      initials,
      hospitals: mappedHospitals,
    };
  }
}
