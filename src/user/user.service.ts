import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRole } from './types/user.role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      return await this.userRepository.findOne({ where: { id } });
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

  async findAllStudents(): Promise<User[]> {
    try {
      return this.userRepository.find({ where: { role: UserRole.STUDENT } });
    } catch (err) {
      throw err;
    }
  }
}
