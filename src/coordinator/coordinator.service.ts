import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/user/types/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CoordinatorProfileDto } from './dto/coordinator-profile.dto';
import { CoordinatorProfile } from './entity/coordinator-profile.entity';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectRepository(CoordinatorProfile)
    private readonly coordinatorRepository: Repository<CoordinatorProfile>,
    private readonly userService: UserService,
  ) {}

  async saveProfile(
    id: string,
    body: CoordinatorProfileDto,
  ): Promise<CoordinatorProfile> {
    try {
      const user = await this.userService.findUserById(id);
      if (!user || user.role !== UserRole.COORDINATOR)
        throw new NotFoundException('Coordinator not found');
      return await this.coordinatorRepository.save({
        ...body,
        user,
      });
    } catch (err) {
      throw err;
    }
  }

  async getProfile(id: string): Promise<CoordinatorProfile> {
    try {
      return await this.coordinatorRepository.findOne({
        where: { user: id },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(
    id: string,
    body: CoordinatorProfileDto,
  ): Promise<CoordinatorProfile> {
    try {
      const user = await this.userService.findUserById(id);
      if (!user || user.role !== UserRole.COORDINATOR)
        throw new NotFoundException('Coordinator not found');
      const profile = await this.coordinatorRepository.findOne({
        where: { user: id },
      });
      return await this.coordinatorRepository.save({
        ...profile,
        ...body,
      });
    } catch (err) {
      throw err;
    }
  }
}
