import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { Response } from 'express';
import * as excel4node from 'excel4node';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import {
  CollegeDepartmentEntity,
  CourseEntity,
  SemesterEntity,
  StudentCourseEntity,
  UserEntity,
} from 'entities/index.entity';
import { UserService } from 'user/user.service';

import {
  CreateCourseDto,
  AddStudentDto,
  ExportCourseDataDto,
  TransferStudentToCourseDto,
  TransferCourseSettingDto,
} from '../dto';
import { ICourseDetailResponse, ICourseResponse } from '../response';
import { IUserResponse } from 'user/response';
import { CourseTrainingSiteService } from './course-training-site.service';
import { TrainingSiteTimeSlotService } from 'training-time-slot/training-time-slot.service';
import { PlacementService } from 'placement/placement.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    private readonly courseTrainingSiteService: CourseTrainingSiteService,
    private readonly timeslotService: TrainingSiteTimeSlotService,
    private readonly placementService: PlacementService,
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
    let course = {};
    course = {
      ...course,
      name,
      department: { id: departmentId } as CollegeDepartmentEntity,
      semester: { id: semesterId } as SemesterEntity,
    };
    if (coordinatorId) {
      course = {
        ...course,
        coordinator: { id: coordinatorId } as UserEntity,
      };
    }
    const newCourse = await this.courseRepository.save(course);

    return this.transformToResponse(newCourse);
  }

  async addStudent(bodyDto: AddStudentDto): Promise<ISuccessMessageResponse> {
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

  async transferStudentsToCourse(
    body: TransferStudentToCourseDto,
  ): Promise<ISuccessMessageResponse> {
    await Promise.all(
      body.studentIds.map(async (studentId) => {
        const existingStudentInCourse =
          await this.studentCourseRepository.findOne({
            where: {
              course: { id: body.courseId },
              student: { id: studentId },
            },
          });

        if (existingStudentInCourse) {
          return;
        }

        await this.studentCourseRepository.save({
          course: { id: body.courseId } as CourseEntity,
          student: { id: studentId } as UserEntity,
        });
      }),
    );

    return { message: 'Students are transfered to the course successfully.' };
  }

  public async transferCourseSetting(body: TransferCourseSettingDto) {
    try {
      const { sourceCourseId, destinationCourseId, transferProperties } = body;
      const course = await this.courseRepository.findOne({
        where: { id: sourceCourseId },
        loadEagerRelations: false,
        relations: [
          'trainingSite',
          'trainingSite.departmentUnit',
          'trainingSite.timeslots',
          'trainingSite.timeslots.placements',
          'trainingSite.timeslots.placements.student',
          'student',
          'student.student',
        ],
      });

      if (body.transferProperties.includes('trainingSites')) {
        const trainingSites = course.trainingSite;
        await Promise.all(
          trainingSites.map(async (site) => {
            console.log('site', site);
            const departmentUnitId = site.departmentUnit.id;
            const { trainingSiteId } =
              await this.courseTrainingSiteService.createTrainingSite({
                courseId: destinationCourseId,
                departmentUnitId,
              });

            if (body.transferProperties.includes('timeslots')) {
              const timeslots = site.timeslots;

              await Promise.all(
                timeslots.map(async (slot) => {
                  const { startTime, endTime, capacity, day } = slot;
                  const { newTimeSlots } = await this.timeslotService.save({
                    timeslots: [{ startTime, endTime, capacity, day }],
                    trainingSiteId,
                  });

                  if (transferProperties.includes('placement')) {
                    const slotStudents = slot.placements;
                    const mappedSlotStudents = slotStudents.map((student) => {
                      return student.student.id;
                    });

                    const timeslot = newTimeSlots[0];
                    const timeslotId = timeslot.id;

                    await this.placementService.assignPlacment({
                      timeSlotIds: [timeslotId],
                      trainingSiteId: site.id,
                      studentIds: mappedSlotStudents,
                    });
                  }
                }),
              );
            }
          }),
        );
      }

      if (body.transferProperties.includes('students')) {
        const students = course.student;

        await Promise.all(
          students.map(async ({ student }) => {
            await this.studentCourseRepository.save({
              course: { id: destinationCourseId } as CourseEntity,
              student: { id: student.id } as UserEntity,
            });
          }),
        );
      }

      return { message: 'Course setting transfer is completed successfully.' };
    } catch (err) {
      console.log('err here', err);
      throw new BadRequestException('bad request');
    }
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
      loadEagerRelations: false,
      relations: ['department', 'semester', 'coordinator'],
    });

    return allCourses.map((course) => this.transformToDetailResponse(course));
  }

  async findAllCourses(departmentId: string): Promise<CourseEntity[]> {
    try {
      return await this.courseRepository.find({
        where: { department: { id: departmentId } },
        loadEagerRelations: false,
        relations: ['semester', 'coordinator'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findOneCourse(id: string): Promise<ICourseDetailResponse> {
    const course = await this.courseRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: ['department', 'semester', 'coordinator'],
    });

    return this.transformToDetailResponse(course);
  }

  async findCourseStudents(courseId: string): Promise<IUserResponse[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['student', 'student.student'],
    });

    const allStudents = course?.student.map((student) => {
      const { id, name, email, studentId } = student.student;
      return {
        id,
        email,
        name,
        studentId,
      };
    });

    return allStudents;
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
        id: coordinator?.id,
        name: coordinator?.name,
        email: coordinator?.email,
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
