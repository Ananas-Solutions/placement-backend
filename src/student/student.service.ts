import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { User } from 'src/user/entity/user.entity';

import { UserRole } from 'src/user/types/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  CreateBulkStudentDto,
  CreateStudentDto,
} from './dto/bulk-student-upload.dto';
import { StudentProfileDto } from './dto/student-profile.dto';
import { StudentProfile } from './entity/student-profile.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly studentProfileRepository: Repository<StudentProfile>,
    private readonly userService: UserService,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async saveStudent(body: CreateStudentDto): Promise<User> {
    try {
      const studentUser = await this.userService.saveUser({
        email: body.email,
        name: body.name,
        role: UserRole.STUDENT,
        password: 'student',
      });
      await this.studentProfileRepository.save({
        user: { id: studentUser.id },
      });
      return studentUser;
    } catch (err) {
      throw err;
    }
  }

  async saveBulkStudent(body: CreateBulkStudentDto): Promise<any> {
    try {
      const allStudents = await Promise.all(
        body.students.map(async (student: CreateStudentDto) => {
          const foundStudent = await this.userService.findUserByEmail(
            student.email,
          );
          if (foundStudent) {
            return foundStudent;
          }
          const studentUser = await this.userService.saveUser({
            email: student.email,
            name: student.name,
            role: UserRole.STUDENT,
            password: 'student',
          });

          const savedProfile = await this.studentProfileRepository.save({
            studentId: student.studentId,
            user: { id: studentUser.id },
          });
          return studentUser;
        }),
      );
      const mappedStudents = allStudents.map((student: any) => student.id);
      return await this.studentCourseService.assignStudents({
        course: body.courseId,
        students: mappedStudents.filter(Boolean),
      });
    } catch (err) {
      console.log('error bulk upload', err);
      throw err;
    }
  }

  async saveProfile(
    id: string,
    body: StudentProfileDto,
  ): Promise<StudentProfile> {
    try {
      const { name, ...profileData } = body;
      return await this.studentProfileRepository.save({
        ...profileData,
        user: { id: id } as User,
      });
    } catch (err) {
      throw err;
    }
  }

  async getProfile(id: string): Promise<StudentProfile> {
    try {
      const studentProfile = await this.studentProfileRepository.findOne({
        where: { user: id },
        relations: ['user'],
      });
      return studentProfile;
    } catch (err) {
      throw err;
    }
  }

  async updateProfile(
    id: string,
    body: StudentProfileDto,
  ): Promise<StudentProfile> {
    try {
      const { name, ...profileData } = body;
      const user = await this.userService.findUserById(id);
      if (!user || user.role !== UserRole.STUDENT)
        throw new NotFoundException('Student not found');
      await this.userService.updateUser(id, { name });
      const profile = await this.studentProfileRepository.findOne({
        where: { user: id },
      });
      return await this.studentProfileRepository.save({
        ...profile,
        ...profileData,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateProfileAssets(id: string, body: any): Promise<StudentProfile> {
    try {
      const { name, studentId, ...profileData } = body;
      const user = await this.userService.findUserById(id);
      if (!user || user.role !== UserRole.STUDENT)
        throw new NotFoundException('Student not found');
      await this.userService.updateUser(id, { name });
      const profile = await this.studentProfileRepository.findOne({
        where: { user: id },
      });
      return await this.studentProfileRepository.save({
        ...profile,
        ...profileData,
      });
    } catch (err) {
      throw err;
    }
  }
}
