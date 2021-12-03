import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { Courses } from 'src/courses/entity/courses.entity';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  AssignCoordinatorsToCourseDto,
  AssignCoursesToCoordinator,
} from './dto/coordinator-course.dto';

import { CoordinatorCourse } from './entity/coordinator-course.entity';

@Injectable()
export class CoordinatorCourseService {
  constructor(
    @InjectRepository(CoordinatorCourse)
    private readonly coordinatorCourseRepository: Repository<CoordinatorCourse>,
    private readonly userService: UserService,
    private readonly courseService: CoursesService,
  ) {}

  async assignCoordinatorToCourses(
    body: AssignCoordinatorsToCourseDto,
  ): Promise<{ message: string }> {
    try {
      const course = await this.courseService.findOneCourse(body.course);
      if (!course) throw new NotFoundException('Course not found');
      await Promise.all(
        body.coordinators.map(async (coordinatorId: string) => {
          const coordinator = await this.userService.findUserById(
            coordinatorId,
          );
          await this.coordinatorCourseRepository.save({ course, coordinator });
        }),
      );
      return { message: 'Coordinators assigned to course' };
    } catch (err) {
      throw err;
    }
  }

  async assignCoursesToCoordinator(
    body: AssignCoursesToCoordinator,
  ): Promise<{ message: string }> {
    try {
      const coordinator = await this.userService.findUserById(body.coordinator);
      if (!coordinator) throw new NotFoundException('Coordinator not found');
      await Promise.all(
        body.courses.map(async (courseId: string) => {
          const course = await this.courseService.findOneCourse(courseId);
          await this.coordinatorCourseRepository.save({ course, coordinator });
        }),
      );
      return { message: 'Courses assigned to coordinator' };
    } catch (err) {
      throw err;
    }
  }

  async findCoordinatorCourses(coordinatorId: string): Promise<Courses[]> {
    try {
      const coordinatorCourses = await this.coordinatorCourseRepository.find({
        where: { coordinator: coordinatorId },
        relations: ['course'],
      });
      const courses = coordinatorCourses.map(
        (coordinatorCourse) => coordinatorCourse.course,
      );
      return courses;
    } catch (err) {
      throw err;
    }
  }

  async findCourseCoordinators(courseId: string): Promise<User[]> {
    try {
      const coordinatorCourses = await this.coordinatorCourseRepository.find({
        where: { course: courseId },
        relations: ['coordinator'],
      });
      const coordinators = coordinatorCourses.map(
        (coordinatorCourse) => coordinatorCourse.coordinator,
      );
      return coordinators;
    } catch (err) {
      throw err;
    }
  }
}
