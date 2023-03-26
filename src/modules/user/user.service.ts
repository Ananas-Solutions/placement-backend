import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentProfileEntity } from 'entities/student-profile.entity';
import { UserEntity } from 'entities/user.entity';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserResponse } from './response';
import { UserRoleEnum } from 'commons/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StudentProfileEntity)
    private readonly studentRepository: Repository<StudentProfileEntity>,
  ) {}

  async saveUser(body: UserDto): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (existingUser) throw new ConflictException('Email already used');

    const user = this.userRepository.create(body);
    const newUser = await this.userRepository.save(user);

    return this.transformToResponse(newUser);
  }

  async findUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return this.transformToResponse(user);
  }
  async findStudentById(id: string): Promise<IUserResponse> {
    const student = await this.userRepository.findOne({
      where: { id },
      relations: ['studentProfile'],
    });

    return this.transformToResponse(student);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAllSpecificUser(role: UserRoleEnum): Promise<IUserResponse[]> {
    const allUsers = await this.userRepository.find({
      where: { role },
      order: { name: 'ASC' },
    });

    return allUsers.map((user) => this.transformToResponse(user));
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<IUserResponse> {
    await this.userRepository.update(id, body);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    return this.transformToResponse(updatedUser);
  }

  private transformToResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role } = user;

    return {
      id,
      name,
      email,
      role,
    };
  }
}
