import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { DataResponse, SuccessMessageResponse } from 'commons/response';
import { AuthorityEntity } from 'entities/authority.entity';

import { AuthorityDto } from './dto';
import { AuthorityResponse } from './response/authority.response';
import { ISingleAuthorityResponse } from './response/single-authority.response';
import { SearchQueryDto } from 'commons/dto';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private authorityRepository: Repository<AuthorityEntity>,
  ) {}

  async saveAuthority(
    body: AuthorityDto,
  ): Promise<DataResponse<AuthorityResponse>> {
    const existingAuthority = await this.authorityRepository.findOne({
      where: { name: body.name },
    });
    if (existingAuthority) {
      throw new ConflictException(
        'Authority with the same name already exists in the system.',
      );
    }

    const newAuthority = await this.authorityRepository.save(body);

    return {
      data: newAuthority,
      message: 'Authority created successfully',
    };
  }

  async findAllAuthority(
    query: SearchQueryDto,
  ): Promise<DataResponse<AuthorityResponse[]>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<AuthorityEntity> = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [allAuthorities, totalItems] =
      await this.authorityRepository.findAndCount({
        where,
        loadEagerRelations: false,
        order: {
          name: 'asc',
        },
        skip,
        take: limit,
      });

    return {
      data: allAuthorities,
      metadata: {
        ...query,
        totalItems,
      },
    };
  }

  async findOneAuthority(id: string): Promise<DataResponse<AuthorityEntity>> {
    const authority = await this.authorityRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: ['hospitals'],
    });

    return {
      data: authority,
    };
  }

  async updateOneAuthority(
    authorityId: string,
    body: AuthorityDto,
  ): Promise<DataResponse<AuthorityEntity>> {
    await this.authorityRepository.update({ id: authorityId }, body);
    const authority = await this.authorityRepository.findOne({
      where: { id: authorityId },
      loadEagerRelations: false,
    });

    return {
      message: 'Authority fetched successfully',
      data: authority,
    };
  }

  async deleteOneAuthority(id: string): Promise<SuccessMessageResponse> {
    const authority = await this.authorityRepository.findOne({
      where: { id },
    });
    await this.authorityRepository.softRemove(authority);
    return { message: 'Authority deleted successfully' };
  }
}
