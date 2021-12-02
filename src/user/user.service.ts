import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveUser(body: UserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(body);
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
