import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { StudentProfileEntity } from 'entities/student-profile.entity';
import { UserEntity } from 'entities/user.entity';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserResponse } from './response';

import { UpdateStudentUserDto } from './dto';

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

  async getUserById(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    return this.transformToUserResponse(user);
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
    return await this.userRepository.findOne({
      where: { email },
      loadEagerRelations: false,
    });
  }

  async findUserByStudentId(studentId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { studentId, deletedAt: null },
      loadEagerRelations: false,
    });
  }

  async findAllSpecificUser(role: UserRoleEnum): Promise<IUserResponse[]> {
    const allUsers = await this.userRepository.find({
      where: { role },
      loadEagerRelations: false,
      order: { name: 'ASC' },
    });

    return allUsers.map((user) => this.transformToResponse(user));
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<IUserResponse> {
    await this.userRepository.update(id, body);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });

    return this.transformToResponse(updatedUser);
  }

  async updateStudentUser(
    id: string,
    body: UpdateStudentUserDto,
  ): Promise<IUserResponse> {
    const student = await this.userRepository.findOne({ where: { id } });

    if (student.studentId !== body.studentId) {
      const existingStudentByStudentId = await this.userRepository.findOne({
        where: { studentId: body.studentId },
      });

      if (existingStudentByStudentId) {
        throw new ConflictException(
          'Student with the same student id already exists.',
        );
      }
    }

    if (student.email !== body.email) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: body.email },
      });

      if (existingUserByEmail) {
        throw new ConflictException(
          'User with the same email address already exists.',
        );
      }
    }

    await this.userRepository.update(id, body);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      loadEagerRelations: false,
    });

    return this.transformToResponse(updatedUser);
  }

  async deleteUser(userId: string): Promise<ISuccessMessageResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    await this.userRepository.softRemove(user);

    return { message: 'User removed successfully.' };
  }

  async changePassword(
    userId: string,
    body: {
      oldPassword: string;
      newPassword: string;
    },
  ): Promise<ISuccessMessageResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!bcrypt.compareSync(body.oldPassword, user.password)) {
      throw new ConflictException('Old password is incorrect.');
    }

    const updatedPassword = await bcrypt.hash(body.newPassword, 10);
    await this.userRepository.update(
      { id: userId },
      { password: updatedPassword },
    );

    return { message: 'Password updated successfully.' };
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
