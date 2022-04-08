import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBulkStudentDto, UserDto } from './dto/user.dto';
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

  async saveBulkStudent(body: CreateBulkStudentDto): Promise<any> {
    try {
      await Promise.all(
        body.students.map(async (student) => {
          const newStudent = this.userRepository.create({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            password: 'ramu1234',
            role: UserRole.STUDENT,
          });
          return await this.userRepository.save(newStudent);
        }),
      );
      return { message: 'Student uploaded on bulk' };
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

  async findAllSpecifcUser(role: UserRole): Promise<User[]> {
    try {
      return this.userRepository.find({ where: { role } });
    } catch (err) {
      throw err;
    }
  }
}
