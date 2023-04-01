import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as excel4node from 'excel4node';
import { Response } from 'express';
import { createQueryBuilder, Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { CourseEntity } from 'entities/courses.entity';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserEntity } from 'entities/user.entity';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';
import { SemesterEntity } from 'entities/semester.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';
import { UserService } from 'user/user.service';

import { AddStudentDto } from './dto/add-student.dto';
import { CourseTrainingSiteDto } from './dto/course-training-site.dto';
import { CreateCourseDto } from './dto';
import { ExportCourseDataDto } from './dto';
import { ICourseDetailResponse, ICourseResponse } from './response';

import { CourseTrainingSiteResponse } from './response/course-training-site.response';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly trainingSiteRepository: Repository<CourseTrainingSiteEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    private readonly userService: UserService,
  ) {}

  async createCourse(
    userId: string,
    bodyDto: CreateCourseDto,
  ): Promise<ICourseResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.role !== UserRoleEnum.ADMIN && !bodyDto.coordinatorId) {
      bodyDto.coordinatorId = userId;
    }
    const { semesterId, departmentId, coordinatorId, name } = bodyDto;
    const newCourse = await this.courseRepository.save({
      name: name,
      coordinator: { id: coordinatorId } as UserEntity,
      department: { id: departmentId } as CollegeDepartmentEntity,
      semester: { id: semesterId } as SemesterEntity,
    });

    return this.transformToResponse(newCourse);
  }

  async addStudent(bodyDto: AddStudentDto): Promise<{ message: string }> {
    const studentFromEmail = await this.userService.findUserByEmail(
      bodyDto.email,
    );
    const studentFromStudentId = await this.userService.findUserByStudentId(
      bodyDto.studentId,
    );
    let newStudent;

    if (studentFromEmail && studentFromEmail.role !== UserRoleEnum.STUDENT) {
      throw new ConflictException('Email already used.');
    }

    if (studentFromStudentId) {
      throw new ConflictException(
        'Student with the given id already exists in the system.',
      );
    }

    if (!studentFromEmail && !studentFromStudentId) {
      newStudent = await this.userService.saveUser({
        name: bodyDto.name,
        email: bodyDto.email,
        password: 'student',
        role: UserRoleEnum.STUDENT,
        studentId: bodyDto.studentId,
      });
    } else {
      newStudent = studentFromEmail;
    }

    const studentCourse = await this.studentCourseRepository.findOne({
      where: {
        student: { id: newStudent.id },
        course: { id: bodyDto.courseId },
      },
    });

    if (studentCourse) {
      throw new ConflictException(
        'Student has already been assigned to this course.',
      );
    }

    await this.studentCourseRepository.save({
      course: { id: bodyDto.courseId } as CourseEntity,
      student: { id: newStudent.id } as UserEntity,
    });

    return { message: 'Student has been added to the course successfully.' };
  }

  async allCourses(userId: string): Promise<ICourseDetailResponse[]> {
    let whereClause = {};
    const user = await this.userService.findUserById(userId);
    if (user.role === UserRoleEnum.CLINICAL_COORDINATOR) {
      whereClause = {
        ...whereClause,
        coordinator: {
          id: userId,
        },
      };
    }
    const allCourses = await this.courseRepository.find({
      where: whereClause,
      relations: ['department', 'semester', 'coordinator'],
    });

    return allCourses.map((course) => this.transformToDetailResponse(course));
  }

  async findAllCourses(departmentId: string): Promise<CourseEntity[]> {
    try {
      return await this.courseRepository.find({
        where: { department: { id: departmentId } },
        relations: ['semester', 'coordinator'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneCourse(id: string): Promise<ICourseDetailResponse> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['department', 'semester', 'coordinator'],
    });

    return this.transformToDetailResponse(course);
  }

  async updateCourse(
    courseId: string,
    bodyDto: CreateCourseDto,
  ): Promise<ICourseDetailResponse> {
    const { semesterId, departmentId, coordinatorId, ...body } = bodyDto;

    let updateBody = {};
    updateBody = {
      ...updateBody,
      ...body,
      department: { id: departmentId } as CollegeDepartmentEntity,
      semester: { id: semesterId } as SemesterEntity,
    };

    if (coordinatorId) {
      updateBody = {
        ...updateBody,
        coordinator: { id: coordinatorId } as UserEntity,
      };
    }
    await this.courseRepository.update({ id: courseId }, updateBody);

    return this.findOneCourse(courseId);
  }

  async deleteCourse(id: string): Promise<ISuccessMessageResponse> {
    const course = await this.courseRepository.findOne({ where: { id } });

    await this.courseRepository.softRemove(course);

    return { message: 'Course deleted successfully' };
  }

  async addTrainingSite(
    body: CourseTrainingSiteDto,
  ): Promise<ISuccessMessageResponse> {
    const { courseId, departmentUnitId } = body;
    const existingTrainingSite = await this.trainingSiteRepository.findOne({
      where: {
        course: { id: courseId },
        departmentUnit: { id: departmentUnitId },
      },
    });
    if (existingTrainingSite) {
      throw new ConflictException(
        'The following training site already exists in this course.',
      );
    }
    await this.trainingSiteRepository.save({
      course: { id: courseId } as CourseEntity,
      departmentUnit: { id: departmentUnitId } as DepartmentUnitEntity,
    });

    return { message: 'Training site added successfully.' };
  }

  async getAllTrainingSite(
    courseId: string,
  ): Promise<CourseTrainingSiteResponse[]> {
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

      const courseData = await createQueryBuilder(CourseEntity, 'course')
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
          `\r Course: ${courseData.name} \r \r Department: ${department.name} \r`,
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
              student: { studentId, name, email },
            } = p;

            ws.cell(studentRow, studentIdCol).string(studentId);
            ws.cell(studentRow, studentNameCol).string(name);
            ws.cell(studentRow, studentEmailCol).string(email);

            studentRow += 1;
          });

          const updatedDay = day.join(', ');

          ws.cell(slotRow, dayCol, studentRow - 1, dayCol, true)
            .string(updatedDay)
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
      console.error('error here', error);
    }
  }

  private transformToResponse(entity: CourseEntity): ICourseResponse {
    const { id, name } = entity;
    return {
      id,
      name,
    };
  }

  private transformToDetailResponse(
    entity: CourseEntity,
  ): ICourseDetailResponse {
    const { id, name, coordinator, department, semester } = entity;

    return {
      id,
      name,
      coordinator: {
        id: coordinator.id,
        name: coordinator.name,
        email: coordinator.email,
      },
      department: { id: department.id, name: department.name },
      semester: {
        id: semester.id,
        semester: semester.semester,
        startYear: semester.startYear,
        endYear: semester.endYear,
      },
    };
  }
}
