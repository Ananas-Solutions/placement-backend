import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

import { UserRole } from 'src/user/types/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentProfile } from './entity/student-profile.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
    private readonly userService: UserService,
  ) {}

  async saveProfile(
    id: string,
    body: StudentProfileDto,
  ): Promise<StudentProfile> {
    try {
      return await this.studentProfileRepository.save({
        ...body,
        user: { id } as User,
      });
    } catch (err) {
      throw err;
    }
  }

  async getProfile(id: string): Promise<StudentProfile> {
    try {
      return await this.studentProfileRepository.findOne({
        where: { user: id },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(id: string, body: any): Promise<StudentProfile> {
    try {
      const user = await this.userService.findUserById(id);
      if (!user || user.role !== UserRole.STUDENT)
        throw new NotFoundException('Student not found');
      const profile = await this.studentProfileRepository.findOne({
        where: { user: id },
      });
      return await this.studentProfileRepository.save({ ...profile, ...body });
    } catch (err) {
      throw err;
    }
  }
}
