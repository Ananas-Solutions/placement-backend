import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { User } from 'src/user/entity/user.entity';

import { UserRole } from 'src/user/types/user.role';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateBulkStudentDto, Student } from './dto/bulk-student-upload.dto';
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

  async saveBulkStudent(body: CreateBulkStudentDto): Promise<any> {
    // try {
    const allStudents = await Promise.allSettled(
      body.students.map(async (student: Student) => {
        return await this.userService.saveUser({
          email: student.email,
          name: `${student.firstName} ${student.lastName}`,
          role: UserRole.STUDENT,
          password: 'student',
        });
      }),
    );
    const mappedStudents = allStudents.map((student: any) => {
      if (student.status === 'fulfilled') {
        return student.value.id;
      }
    });
    await this.studentCourseService.assignStudents({
      course: body.courseId,
      students: mappedStudents.filter(Boolean),
    });
    return { message: 'Student upload succesful' };
    // } catch (err) {
    //   throw err;
    // }
  }

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
