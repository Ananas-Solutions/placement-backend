import { ConflictException, Injectable } from '@nestjs/common';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { UserEntity } from 'entities/index.entity';
import {
  StudentProfileRepositoryService,
  UserRepositoryService,
} from 'repository/services';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserResponse } from './response';
import { UpdateStudentUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly studentRepository: StudentProfileRepositoryService,
  ) {}

  async saveUser(body: UserDto): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findOne({
      email: body.email,
    });
    if (existingUser) throw new ConflictException('Email already used');

    const user = await this.userRepository.create(body);
    const newUser = await this.userRepository.save(user);

    return this.transformToResponse(newUser);
  }

  async getUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ id });

    return this.transformToUserResponse(user);
  }

  async findUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      id,
    });
    return this.transformToResponse(user);
  }
  async findStudentById(id: string): Promise<IUserResponse> {
    const student = await this.userRepository.findOne(
      {
        id,
      },
      { studentProfile: true },
    );

    return this.transformToResponse(student);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      email,
    });
  }

  async findUserByStudentId(studentId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      studentId,
    });
  }

  async findAllSpecificUser(role: UserRoleEnum): Promise<IUserResponse[]> {
    const allUsers = await this.userRepository.findMany(
      {
        role,
      },
      {},
      { order: { name: 'ASC' } },
    );

    return allUsers.map((user) => this.transformToResponse(user));
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<IUserResponse> {
    await this.userRepository.update({ id }, body);
    const updatedUser = await this.userRepository.findOne({
      id,
    });

    return this.transformToResponse(updatedUser);
  }

  async updateStudentUser(
    id: string,
    body: UpdateStudentUserDto,
  ): Promise<IUserResponse> {
    const student = await this.userRepository.findOne({ id });

    if (student.studentId !== body.studentId) {
      const existingStudentByStudentId = await this.userRepository.findOne({
        studentId: body.studentId,
      });

      if (existingStudentByStudentId) {
        throw new ConflictException(
          'Student with the same student id already exists.',
        );
      }
    }

    if (student.email !== body.email) {
      const existingUserByEmail = await this.userRepository.findOne({
        email: body.email,
      });

      if (existingUserByEmail) {
        throw new ConflictException(
          'User with the same email address already exists.',
        );
      }
    }

    await this.userRepository.update({ id }, body);
    const updatedUser = await this.userRepository.findOne({
      id,
    });

    return this.transformToResponse(updatedUser);
  }

  async deleteUser(userId: string): Promise<ISuccessMessageResponse> {
    await this.userRepository.delete({
      id: userId,
    });

    return { message: 'User removed successfully.' };
  }

  private transformToResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role, studentId } = user;

    return {
      id,
      name,
      email,
      role,
      studentId,
    };
  }

  private transformToUserResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role } = user;
    return {
      id,
      name,
      email,
      role,
    };
  }
}
