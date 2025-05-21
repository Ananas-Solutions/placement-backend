import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from 'commons/enums';
import { StudentProfileEntity } from 'entities/student-profile.entity';
import { UserEntity } from 'entities/user.entity';
import { EmailService } from 'helper/send-email.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUserResponse } from './response';

import { UpdateStudentUserDto } from './dto';
import { SuccessMessageResponse } from 'commons/response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StudentProfileEntity)
    private readonly studentRepository: Repository<StudentProfileEntity>,
    private readonly emailService: EmailService,
  ) {}

  async saveUser(body: UserDto): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: body.email.trim().toLowerCase() },
    });
    if (existingUser) throw new ConflictException('Email already used');

    let updatedPassword = body.password;

    // generating a random password if user role is student
    if (body.role === UserRoleEnum.STUDENT) {
      updatedPassword = 'student';
    }

    const user = this.userRepository.create({
      ...body,
      password: updatedPassword,
      isFirstLogin: body.role === UserRoleEnum.STUDENT ? true : false,
    });

    const newUser = await this.userRepository.save(user);

    if (body.role === UserRoleEnum.STUDENT) {
      // send email to student with their email and randomly generated password

      await this.emailService.sendLoginDetails({
        to: body.email.trim().toLowerCase(),
        emailData: {
          name: body.name,
          email: body.email.trim().toLowerCase(),
          password: updatedPassword,
          role: UserRoleEnum.STUDENT.toLowerCase(),
        },
      });
    }

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
      where: { email: email.trim().toLowerCase() },
      loadEagerRelations: false,
    });
  }

  async findUserByStudentId(studentId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { studentId: studentId.trim().toLowerCase(), deletedAt: null },
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

    if (
      student.studentId.trim().toLowerCase() !==
      body.studentId.trim().toLowerCase()
    ) {
      const existingStudentByStudentId = await this.userRepository.findOne({
        where: { studentId: body.studentId.trim().toLowerCase() },
      });

      if (existingStudentByStudentId) {
        throw new ConflictException(
          'Student with the same student id already exists.',
        );
      }
    }

    if (
      student.email.trim().toLowerCase() !== body.email.trim().toLowerCase()
    ) {
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: body.email.trim().toLowerCase() },
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

  async deleteUser(userId: string): Promise<SuccessMessageResponse> {
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
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!bcrypt.compareSync(body.oldPassword, user.password)) {
      throw new ConflictException('Old password is incorrect.');
    }

    const updatedPassword = await bcrypt.hash(body.newPassword, 10);
    await this.userRepository.update(
      { id: userId },
      { password: updatedPassword, isFirstLogin: false },
    );

    return { message: 'Password updated successfully.', userId };
  }

  private transformToResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role, studentId } = user;

    return {
      id,
      name,
      email: email?.trim().toLowerCase(),
      role,
      studentId: studentId.trim().toLowerCase(),
    };
  }

  private transformToUserResponse(user: UserEntity): IUserResponse {
    const { id, name, email, role } = user;
    return {
      id,
      name,
      email: email?.trim().toLowerCase(),
      role,
    };
  }

  private generateRandomString(length) {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }
}
