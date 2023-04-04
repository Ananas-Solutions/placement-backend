import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { CourseEntity } from 'entities/courses.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserEntity } from 'entities/user.entity';

import { AssignCoursesToStudentDto, AssignStudentsToCourseDto } from './dto';
import { ICourseStudentResponse, IStudentCourseResponse } from './response';

@Injectable()
export class StudentCourseService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
  ) {}

  async assignStudents(
    body: AssignStudentsToCourseDto,
  ): Promise<ISuccessMessageResponse> {
    const { courseId, studentsId } = body;
    await Promise.all(
      studentsId.map(async (studentId: any) => {
        const studentCourse = await this.studentCourseRepository.findOne({
          where: { student: { id: studentId }, course: { id: courseId } },
        });
        if (studentCourse) {
          return;
        }
        return await this.studentCourseRepository.save({
          course: { id: courseId } as CourseEntity,
          student: { id: studentId } as UserEntity,
        });
      }),
    );

    return { message: 'Students assigned to course successfully.' };
  }

  async assignCourses(
    body: AssignCoursesToStudentDto,
  ): Promise<ISuccessMessageResponse> {
    await Promise.all(
      body.coursesId.map(async (courseId: string) => {
        await this.studentCourseRepository.save({
          course: { id: courseId },
          student: { id: body.studentId },
        });
      }),
    );

    return { message: 'Courses assigend to student successfully.' };
  }

  async findStudentCourses(
    studentId: string,
  ): Promise<IStudentCourseResponse[]> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { student: { id: studentId } },
      loadEagerRelations: false,
      relations: ['course'],
    });
    const allCourses = studentCourses.map((studentCourse) =>
      this.transformToStudentCourse(studentCourse),
    );

    return allCourses;
  }

  async findCourseStudents(
    courseId: string,
  ): Promise<ICourseStudentResponse[]> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['student', 'student.studentProfile'],
    });
    const users = studentCourses.map((studentCourse) =>
      this.transformToCourseStudent(studentCourse),
    );

    return users;
  }

  async deleteCourseStudent(
    courseId: string,
    studentId: string,
  ): Promise<ISuccessMessageResponse> {
    const existingStudent = await this.studentCourseRepository.findOne({
      where: { student: { id: studentId }, course: { id: courseId } },
    });
    if (!existingStudent) {
      throw new ConflictException('No student found for this course');
    }
    await this.studentCourseRepository.softRemove(existingStudent);

    return { message: 'Student removed from the course successfully' };
  }

  private transformToStudentCourse(
    entity: StudentCourseEntity,
  ): IStudentCourseResponse {
    const { course } = entity;

    return {
      id: course.id,
      name: course.name,
    };
  }

  private transformToCourseStudent(entity: StudentCourseEntity) {
    const { student } = entity;

    return {
      id: student.id,
      name: student.name,
      email: student.email,
    };
  }
}
