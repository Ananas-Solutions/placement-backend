import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as excel4node from 'excel4node';
import { CollegeDepartment } from 'src/college-department/entity/college-department.entity';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { Semester } from 'src/semester/entity/semester.entity';
import { User } from 'src/user/entity/user.entity';
import { createQueryBuilder, Repository, UpdateResult } from 'typeorm';
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
    const wb = new excel4node.Workbook();
    const ws = wb.addWorksheet('Sheet 1');
    let rowIndex = 1;
    ws.cell(rowIndex++, 1).string('Export Feature');

    const { course: courseId, trainingSites } = data;

    const courseData = await createQueryBuilder(Courses, 'course')
      .where('course.id = :courseId', { courseId })
      .leftJoinAndSelect('course.department', 'courseDepartment')
      .leftJoinAndSelect('course.trainingSite', 'courseTrainingSite')
      .andWhere('courseTrainingSite.id In(:...trainingSitesId)', {
        trainingSitesId: trainingSites,
      })
      .leftJoinAndSelect('courseTrainingSite.departmentUnit', 'departmentUnit')
      .leftJoinAndSelect('departmentUnit.department', 'hospitalDepartment')
      .leftJoinAndSelect('hospitalDepartment.hospital', 'hospital')
      .leftJoinAndSelect('courseTrainingSite.timeslots', 'timeSlots')
      .leftJoinAndSelect('timeSlots.placements', 'placement')
      .leftJoinAndSelect('placement.student', 'student')
      .getOne();

    const { department, trainingSite } = courseData;

    ws.cell(rowIndex++, 1).string(department.name);

    const mappedTrainingSiteInfo = trainingSite.map((site) => {
      const { departmentUnit, timeslots } = site;
      const { department } = departmentUnit;
      const { hospital } = department;
      ws.cell(rowIndex, 1).string(hospital.name);
      ws.cell(rowIndex, 2).string(department.name);
      ws.cell(rowIndex++, 3).string(departmentUnit.name);

      const mappedTimeSlots = timeslots.map((slot) => {
        const { day, startTime, endTime, placements } = slot;
        ws.cell(rowIndex, 1).string(day);
        ws.cell(rowIndex++, 2).string(`${startTime}-${endTime}`);
        const slotStudents = placements.map((p) => {
          const {
            student: { id, name, email },
          } = p;
          ws.cell(rowIndex, 1).string(id);
          ws.cell(rowIndex, 2).string(name);
          ws.cell(rowIndex++, 3).string(email);
          return {
            studentId: id,
            studentName: name,
            studentEmail: email,
          };
        });
        ws.cell(rowIndex++, 1).string(' ');
        return {
          day: day,
          startTime: startTime,
          endTime: endTime,
          timeSlotStudents: slotStudents,
        };
      });
      ws.cell(rowIndex++, 1).string(' ');

      return {
        hospital: hospital.name,
        hospitalDepartment: department.name,
        hospitalUnit: departmentUnit.name,
        timeSlots: mappedTimeSlots,
      };
    });

    wb.write('Excel.xlsx');

    return {
      collegeDepartment: department.name,
      trainingSiteInfo: mappedTrainingSiteInfo,
    };
  }
}
