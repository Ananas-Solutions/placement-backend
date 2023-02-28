import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { CourseTrainingSiteDto } from './dto/course-training-site.dto';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { ExportCourseDataDto } from './dto/export-course.dto';
import { CourseTrainingSite } from './entity/course-training-site.entity';
import { Courses } from './entity/courses.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    @InjectRepository(CourseTrainingSite)
    private readonly trainingSiteRepository: Repository<CourseTrainingSite>,
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
        relations: ['department', 'semester', 'coordinator'],
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

  async addTrainingSite(body: CourseTrainingSiteDto) {
    const { courseId, departmentUnitId } = body;
    return await this.trainingSiteRepository.save({
      course: { id: courseId } as Courses,
      departmentUnit: { id: departmentUnitId } as DepartmentUnits,
    });
  }

  async getAllTrainingSite(courseId: string) {
    const allTrainingSites = await this.trainingSiteRepository.find({
      where: { course: { id: courseId } },
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
      ],
    });

    const mappedResult = allTrainingSites.map((trainingSite) => {
      const { departmentUnit } = trainingSite;
      const { department } = departmentUnit;
      const { hospital } = department;
      console.log;
      return {
        id: trainingSite.id,
        hospital: hospital.name,
        department: department.name,
        departmentUnit: departmentUnit.name,
      };
    });

    return mappedResult;
  }

  public async getTrainingSite(trainingSiteId: string) {
    const trainingSite = await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'timeslots',
      ],
    });
    return trainingSite;
  }
  public async getTrainingSiteSupervisor(trainingSiteId: string) {
    const trainingSite = await this.trainingSiteRepository.findOne({
      where: { id: trainingSiteId },
      relations: [
        'departmentUnit',
        'departmentUnit.departmentSupervisor',
        'departmentUnit.departmentSupervisor.supervisor',
      ],
    });
    const mappedSupervisor = (
      trainingSite.departmentUnit.departmentSupervisor as any
    ).map(({ supervisor }) => supervisor);

    return mappedSupervisor;
  }

  public async exportCourseData(data: ExportCourseDataDto) {
    const { courseId, trainingSites } = data;
    const course = await this.coursesRepository.findOne({
      where: { course: { id: courseId }, trainingSite: In(trainingSites) },
      relations: [
        'department',
        'trainingSite',
        'trainingSite.timeslots',
        'trainingSite.timeslots.supervisor',
      ],
    });
  }
}
