import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalService } from 'src/hospital/hospital.service';
import { Repository } from 'typeorm';
import { CoursesDto, UpdateCoursesDto } from './dto/courses.dto';
import { Courses } from './entity/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    private readonly hospitalService: HospitalService,
  ) {}

  async createCourse(body: CoursesDto): Promise<Courses> {
    try {
      const course = await this.coursesRepository.findOne({
        where: { name: body.name },
      });
      if (course) throw new Error('Course already exist');
      const department = await this.hospitalService.findOneDepartment(
        body.department,
      );
      if (!department) throw new Error('Department not found');
      const newCourse = this.coursesRepository.create({ ...body, department });
      return await this.coursesRepository.save(newCourse);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAllCourses(): Promise<Courses[]> {
    try {
      return await this.coursesRepository.find();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneCourse(id: string): Promise<Courses> {
    try {
      return await this.coursesRepository.findOne({
        where: { id },
        relations: ['department'],
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateCourse(body: UpdateCoursesDto): Promise<Courses> {
    try {
      const course = await this.coursesRepository.findOne({
        where: { name: body.name },
      });
      if (course) throw new Error('Course name already exist');
      const oldCourse = await this.coursesRepository.findOne(body.id);
      if (!oldCourse) throw new Error('Course not found');
      return await this.coursesRepository.save({ ...oldCourse, ...body });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteCourse(id: string): Promise<any> {
    try {
      return await this.coursesRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
