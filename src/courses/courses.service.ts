import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollegeDepartmentService } from 'src/college-department/college-department.service';
import { DepartmentService } from 'src/department/department.service';
import { SemesterService } from 'src/semester/semester.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { Courses } from './entity/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    private readonly collegeDepartmentService: CollegeDepartmentService,
    private readonly semesterService: SemesterService,
  ) {}

  async createCourse(body: CreateCourseDto): Promise<Courses> {
    try {
      const semester = await this.semesterService.findOne(body.semester);
      if (!semester) throw new NotFoundException('Semester not found');
      const collegeDepartment = await this.collegeDepartmentService.findOne(
        body.collegeDepartment,
      );
      if (!collegeDepartment)
        throw new NotFoundException('College Department not found');
      const newCourse = this.coursesRepository.create({
        ...body,
        department: collegeDepartment,
        semester,
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
        relations: ['department', 'semester'],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateCourse(body: UpdateCourseDto): Promise<Courses> {
    try {
      const collegeDepartment = await this.collegeDepartmentService.findOne(
        body.collegeDepartment,
      );
      if (!collegeDepartment)
        throw new NotFoundException('College Department not found');
      const semester = await this.semesterService.findOne(body.semester);
      if (!semester) throw new NotFoundException('Semester not found');
      const oldCourse = await this.coursesRepository.findOne(body.id);
      if (!oldCourse) throw new NotFoundException('Course not found');
      return await this.coursesRepository.save({
        ...oldCourse,
        ...body,
        department: collegeDepartment,
        semester,
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
