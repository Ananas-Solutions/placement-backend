import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as excel4node from 'excel4node';
import { Response } from 'express';
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

  public async getExportTrainingSites(courseId: string) {
    const trainingSites = await this.trainingSiteRepository.find({
      where: {
        course: { id: courseId },
      },
      relations: [
        'departmentUnit',
        'departmentUnit.department',
        'departmentUnit.department.hospital',
        'timeslots',
        'timeslots.placements',
      ],
    });
    const mappedTrainingSites = trainingSites.map((site) => {
      const { timeslots, departmentUnit } = site;
      if (timeslots.length === 0) {
        return undefined;
      }
      const mappedTimeSlots = timeslots.map((slot) => {
        const { placements } = slot;
        if (placements.length === 0) {
          return undefined;
        }
        return {
          trainingSiteId: site.id,
          departmentUnit: departmentUnit.name,
          hospital: departmentUnit.department.hospital.name,
          department: departmentUnit.department.name,
        };
      });
      return mappedTimeSlots;
    });
    const filteredTrainingSites = mappedTrainingSites.flat(10).filter(Boolean);

    const uniqueTrainingSites = [
      ...new Map(
        filteredTrainingSites.map((item) => [item['trainingSiteId'], item]),
      ).values(),
    ];

    return uniqueTrainingSites;
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

  public async exportCourseData(data: ExportCourseDataDto, response: Response) {
    try {
      const { course: courseId, trainingSites } = data;

      const courseData = await createQueryBuilder(Courses, 'course')
        .where('course.id = :courseId', { courseId })
        .leftJoinAndSelect('course.department', 'courseDepartment')
        .leftJoinAndSelect('course.trainingSite', 'courseTrainingSite')
        .andWhere('courseTrainingSite.id In(:...trainingSitesId)', {
          trainingSitesId: trainingSites,
        })
        .leftJoinAndSelect(
          'courseTrainingSite.departmentUnit',
          'departmentUnit',
        )
        .leftJoinAndSelect('departmentUnit.department', 'hospitalDepartment')
        .leftJoinAndSelect('hospitalDepartment.hospital', 'hospital')
        .leftJoinAndSelect('courseTrainingSite.timeslots', 'timeSlots')
        .leftJoinAndSelect('timeSlots.placements', 'placement')
        .leftJoinAndSelect('placement.student', 'student')
        .getOne();

      const { department, trainingSite } = courseData;

      const hospitalCol = 1;
      const departmentCol = 2;
      const departmentUnitCol = 3;
      const dayCol = 4;
      const timeslotCol = 5;
      const studentIdCol = 6;
      const studentNameCol = 7;
      const studentEmailCol = 8;

      const wb = new excel4node.Workbook({
        defaultFont: {
          size: 12,
          name: 'Calibri',
          color: 'FFFFFFFF',
        },
      });

      const ws = wb.addWorksheet('Sheet 1', {
        margins: {
          left: 1.5,
          right: 1.5,
        },
        sheetFormat: {
          baseColWidth: 15,
          defaultColWidth: 25,
        },
      });

      const titleHeaderStyle = wb.createStyle({
        font: {
          color: '#FF8888',
          size: 17,
          bold: true,
        },
        alignment: {
          horizontal: 'center',
        },
      });

      const rowHeaderStyle = wb.createStyle({
        font: {
          color: '#444444',
          size: 15,
          bold: true,
        },
        alignment: {
          horizontal: 'center',
        },
      });

      const mergedCellStyle = wb.createStyle({
        font: {
          color: '#444444',
          size: 13,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      });

      ws.cell(1, hospitalCol, 3, studentEmailCol, true)
        .string(
          `\n Course: ${courseData.name} \n \n Department: ${department.name} \n`,
        )
        .style(titleHeaderStyle);

      let rowIndex = 4;
      ws.cell(rowIndex, hospitalCol).string('Hospital').style(rowHeaderStyle);
      ws.cell(rowIndex, departmentCol)
        .string('Department')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, departmentUnitCol).string('Unit').style(rowHeaderStyle);
      ws.cell(rowIndex, dayCol).string('Day').style(rowHeaderStyle);
      ws.cell(rowIndex, timeslotCol).string('Time slot').style(rowHeaderStyle);
      ws.cell(rowIndex, studentIdCol)
        .string('Student ID')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, studentNameCol)
        .string('Student Name')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, studentEmailCol)
        .string('Student Email')
        .style(rowHeaderStyle);

      rowIndex += 1;

      let siteRow = rowIndex;
      trainingSite.forEach((site) => {
        const { departmentUnit, timeslots } = site;
        const { department } = departmentUnit;
        const { hospital } = department;

        let slotRow = siteRow;
        timeslots.forEach((slot) => {
          const { day, startTime, endTime, placements } = slot;

          let studentRow = slotRow;
          placements.forEach((p) => {
            const {
              student: { id, name, email },
            } = p;

            ws.cell(studentRow, studentIdCol).string(id);
            ws.cell(studentRow, studentNameCol).string(name);
            ws.cell(studentRow, studentEmailCol).string(email);

            studentRow += 1;
          });

          ws.cell(slotRow, dayCol, studentRow - 1, dayCol, true)
            .string(day)
            .style(mergedCellStyle);
          ws.cell(slotRow, timeslotCol, studentRow - 1, timeslotCol, true)
            .string(`${startTime}-${endTime}`)
            .style(mergedCellStyle);

          slotRow = studentRow;
        });

        ws.cell(siteRow, hospitalCol, slotRow - 1, hospitalCol, true)
          .string(hospital.name)
          .style(mergedCellStyle);
        ws.cell(siteRow, departmentCol, slotRow - 1, departmentCol, true)
          .string(department.name)
          .style(mergedCellStyle);
        ws.cell(
          siteRow,
          departmentUnitCol,
          slotRow - 1,
          departmentUnitCol,
          true,
        )
          .string(departmentUnit.name)
          .style(mergedCellStyle);

        siteRow = slotRow;
      });

      wb.write('Excel.xlsx', response);

      return { message: 'Excel exported successfully' };
    } catch (error) {
      console.log('error here', error);
    }
  }
}
