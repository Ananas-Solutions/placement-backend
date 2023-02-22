import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
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

  async createCourse(bodyDto: CreateCourseDto): Promise<Courses> {
    try {
      console.log('bodydto', bodyDto);
      const { semesterId, departmentId, coordinatorId, name } = bodyDto;
      return await this.coursesRepository.save({
        name: name,
        coordinator: { id: coordinatorId } as User,
        department: { id: departmentId } as CollegeDepartment,
        semester: { id: semesterId } as Semester,
      });
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }

  async allCourses(): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find({
        relations: ['department', 'semester', 'coordinator'],
      });
    } catch (err) {
      throw err;
    }
  }
  async allCoordinatorCourses(coordinatorId: string): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find({
        where: { coordinator: { id: coordinatorId } },
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
        relations: ['semester', 'coordinator'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneCourse(id: string): Promise<Courses> {
    try {
      return await this.coursesRepository.findOne({
        where: { id },
        relations: ['department', 'semester', 'coordinator', 'timeslots'],
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
          department: { id: departmentId } as CollegeDepartment,
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
