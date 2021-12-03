import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorityDto, UpdateAuthorityDto } from './dto/authority.dto';
import { Authority } from './entity/authority.entity';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
  ) {}

  async saveAuthority(body: CreateAuthorityDto): Promise<Authority> {
    try {
      return await this.authorityRepository.save(body);
    } catch (err) {
      throw err;
    }
  }

  async findAllAuthority(): Promise<Authority[]> {
    try {
      return await this.authorityRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async findOneAuthority(id: string): Promise<Authority> {
    try {
      return await this.authorityRepository.findOne({
        where: { id },
        relations: ['hospital'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateOneAuthority(body: UpdateAuthorityDto): Promise<Authority> {
    try {
      const authority = await this.authorityRepository.findOne(body.id);
      if (!authority) {
        throw new NotFoundException('Authority not found.');
      }
      return await this.authorityRepository.save({ ...authority, ...body });
    } catch (err) {
      throw err;
    }
  }

  async deleteOneAuthority(id: string): Promise<any> {
    try {
      return await this.authorityRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
