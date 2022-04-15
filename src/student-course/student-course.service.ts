import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { Courses } from 'src/courses/entity/courses.entity';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AssignCoursesDto, AssignStudentsDto } from './dto/student-course.dto';
import { StudentCourse } from './entity/student-course.entity';

@Injectable()
export class StudentCourseService {
  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
    private readonly userService: UserService,
    private readonly courseService: CoursesService,
  ) {}

  async assignStudents(body: AssignStudentsDto): Promise<{ message: string }> {
    try {
      const { course, students } = body;
      if (!course) throw new NotFoundException('Course not found');
      await Promise.all(
        students.map(async (studentId: any) => {
          return await this.studentCourseRepository.save({
            course: { id: course } as Courses,
            student: { id: studentId } as User,
          });
        }),
      );
      return { message: 'Students assigned to course' };
    } catch (err) {
      throw err;
    }
  }

  async assignCourses(body: AssignCoursesDto): Promise<{ message: string }> {
    try {
      const student = await this.userService.findUserById(body.student);
      if (!student) throw new NotFoundException('Student not found');
      await Promise.all(
        body.courses.map(async (courseId: string) => {
          const course = await this.courseService.findOneCourse(courseId);
          await this.studentCourseRepository.save({ course, student });
        }),
      );
      return { message: 'Courses assigend to student' };
    } catch (err) {
      throw err;
    }
  }

  async findStudentCourses(studentId: string): Promise<Courses[]> {
    try {
      const studentCourses = await this.studentCourseRepository.find({
        where: { student: studentId },
        relations: ['course'],
      });
      const courses = studentCourses.map(
        (studentCourse) => studentCourse.course,
      );
      return courses;
    } catch (err) {
      throw err;
    }
  }

  async findCourseStudents(courseId: string): Promise<User[]> {
    try {
      const studentCourses = await this.studentCourseRepository.find({
        where: { course: courseId },
        relations: ['student'],
      });
      const users = studentCourses.map(
        (studentCourse) => studentCourse.student,
      );
      return users;
    } catch (err) {
      throw err;
    }
  }
}
