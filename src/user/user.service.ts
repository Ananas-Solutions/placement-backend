import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentProfile } from 'src/student/entity/student-profile.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRole } from './types/user.role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly studentRepository: Repository<StudentProfile>,
  ) {}

  async saveUser(body: UserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: body.email },
      });
      if (user) throw new ConflictException('Email already used');
      const newUser = this.userRepository.create(body);
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (err) {
      throw err;
    }
  }
  async findStudentById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        relations: ['studentProfile'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      throw err;
    }
  }

  async findAllSpecifcUser(role: UserRole): Promise<User[]> {
    try {
      return this.userRepository.find({
        where: { role },
        order: { name: 'ASC' },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<UpdateResult> {
    try {
      return this.userRepository.update(id, body);
    } catch (err) {
      throw err;
    }
  }
}
