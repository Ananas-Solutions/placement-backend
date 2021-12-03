import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { Courses } from './entity/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
  ) {}

  async createCourse(body: CreateCourseDto): Promise<Courses> {
    try {
      const course = await this.coursesRepository.findOne({
        where: { name: body.name },
      });
      if (course) throw new ConflictException('Course already exist');
      const department = await this.departmentService.findOneDepartment(
        body.department,
      );
      if (!department) throw new NotFoundException('Department not found');
      const newCourse = this.coursesRepository.create({
        ...body,
        department,
      });
      return await this.coursesRepository.save(newCourse);
    } catch (err) {
      throw err;
    }
  }

  async findAllCourses(departmentId: string): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find({
        where: { department: departmentId },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneCourse(id: string): Promise<Courses> {
    try {
      return await this.coursesRepository.findOne({
        where: { id },
        relations: ['department'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateCourse(body: UpdateCourseDto): Promise<Courses> {
    try {
      const department = await this.departmentService.findOneDepartment(
        body.department,
      );
      if (!department) throw new NotFoundException('Department not found');
      const course = await this.coursesRepository.findOne({
        where: { name: body.name },
      });
      if (course) throw new NotFoundException('Course name already exist');
      const oldCourse = await this.coursesRepository.findOne(body.id);
      if (!oldCourse) throw new NotFoundException('Course not found');
      return await this.coursesRepository.save({
        ...oldCourse,
        ...body,
        department,
      });
    } catch (err) {
      console.log('err', err);
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
