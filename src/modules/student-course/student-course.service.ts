import { Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import {
  CourseEntity,
  StudentCourseEntity,
  UserEntity,
} from 'entities/index.entity';
import { StudentCourseRepositoryService } from 'repository/services';

import { AssignCoursesToStudentDto, AssignStudentsToCourseDto } from './dto';
import { ICourseStudentResponse, IStudentCourseResponse } from './response';

@Injectable()
export class StudentCourseService {
  constructor(
    private readonly studentCourseRepository: StudentCourseRepositoryService,
  ) {}

  async assignStudents(
    body: AssignStudentsToCourseDto,
  ): Promise<ISuccessMessageResponse> {
    const { courseId, studentsId } = body;
    await Promise.all(
      studentsId.map(async (studentId: any) => {
        const studentCourse = await this.studentCourseRepository.findOne({
          student: { id: studentId },
          course: { id: courseId },
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
    const studentCourses = await this.studentCourseRepository.findMany(
      {
        student: { id: studentId },
      },
      { course: true },
    );

    const allCourses = studentCourses.map((studentCourse) =>
      this.transformToStudentCourse(studentCourse),
    );

    return allCourses;
  }

  async findCourseStudents(
    courseId: string,
  ): Promise<ICourseStudentResponse[]> {
    const studentCourses = await this.studentCourseRepository.findMany(
      {
        course: { id: courseId },
      },
      { student: { studentProfile: true } },
    );
    const users = studentCourses.map((studentCourse) =>
      this.transformToCourseStudent(studentCourse),
    );

    return users;
  }

  async deleteCourseStudent(
    courseId: string,
    studentId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.studentCourseRepository.delete({
      student: { id: studentId },
      course: { id: courseId },
    });

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
