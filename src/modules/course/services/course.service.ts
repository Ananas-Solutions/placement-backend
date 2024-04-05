import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
import { IUserResponse } from 'user/response';

import {
  AddStudentDto,
  AddStudentToBlockDto,
  CreateBlockDto,
  CreateCourseDto,
  UpdateCourseBlockDto,
} from '../dto';
import { ICourseDetailResponse, ICourseResponse } from '../response';
import { CourseBlockEntity } from 'entities/course-block.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(CourseBlockEntity)
    private readonly courseBlocksRepository: Repository<CourseBlockEntity>,
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

    // if (studentFromStudentId) {
    //   throw new ConflictException(
    //     'Student with the given id already exists in the system.',
    //   );
    // }

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

  async addStudentToBlock(body: AddStudentToBlockDto) {
    const { courseId, blockId, studentIds } = body;

    await Promise.all(
      studentIds.map(async (studentId) => {
        return await this.studentCourseRepository.update(
          {
            student: { id: studentId },
            course: { id: courseId },
          },
          {
            block: { id: blockId } as CourseBlockEntity,
          },
        );
      }),
    );
    return { message: 'Students added to block successfully' };
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

  async findOneCourseBlock(id: string) {
    const courseBlock = await this.courseBlocksRepository.findOne({
      where: { id },
      loadEagerRelations: false,
      relations: [
        'course',
        'course.department',
        'course.semester',
        'course.coordinator',
      ],
    });

    return courseBlock;
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
      order: {
        student: {
          student: {
            name: 'ASC',
          },
        },
      },
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

  public async addBlocks(body: CreateBlockDto) {
    const { courseId, startsFrom, endsAt, blocks, duration } = body;

    await Promise.all(
      blocks.map(async (block) => {
        return await this.courseBlocksRepository.save({
          ...block,
          startsFrom,
          endsAt,
          duration,
          course: { id: courseId } as CourseEntity,
        });
      }),
    );

    return { message: 'Block added successfully.' };
  }

  public async getCourseBlocks(courseId: string) {
    return await this.courseBlocksRepository.find({
      where: { course: { id: courseId } },
      order: {
        name: 'ASC',
      },
    });
  }

  public async updateBlock(blockId: string, body: UpdateCourseBlockDto) {
    const { name, capacity } = body;

    await this.courseBlocksRepository.update(
      { id: blockId },
      { name, capacity },
    );

    return { message: 'Course block edited successfully.' };
  }

  public async deleteBlock(blockId: string) {
    const courseBlock = await this.courseBlocksRepository.findOne({
      where: {
        id: blockId,
      },
      loadEagerRelations: true,
    });

    await this.courseBlocksRepository.softRemove(courseBlock);

    return { message: 'Course block deleted successfully.' };
  }
}
