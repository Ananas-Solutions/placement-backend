import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollegeDepartent } from 'src/college-department/entity/college-department.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { Courses } from './entity/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
  ) {}

  async createCourse(
    bodyDto: CreateCourseDto,
    coordinatorId: string,
  ): Promise<Courses> {
    try {
      const { semesterId, departmentId, ...body } = bodyDto;
      const newCourse = this.coursesRepository.create({
        ...body,
        coordinator: { id: coordinatorId } as User,
        department: { id: departmentId } as CollegeDepartent,
        semester: { id: semesterId } as Semester,
      });
      return await this.coursesRepository.save(newCourse);
    } catch (err) {
      throw err;
    }
  }

  async allCourses(): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find({
        relations: ['department', 'semester'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findAllCourses(departmentId: string): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find({
        where: { department: departmentId },
        relations: ['semester'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneCourse(id: string): Promise<Courses> {
    try {
      return await this.coursesRepository.findOne({
        where: { id },
        relations: ['department', 'semester'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateCourse(bodyDto: UpdateCourseDto): Promise<UpdateResult> {
    try {
      const { semesterId, departmentId, ...body } = bodyDto;
      return await this.coursesRepository.update(
        { id: bodyDto.id },
        {
          ...body,
          department: { id: departmentId } as CollegeDepartent,
          semester: { id: semesterId } as Semester,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteCourse(id: string): Promise<any> {
    try {
      return await this.coursesRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
