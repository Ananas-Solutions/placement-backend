import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import {
  CollegeDepartmentEntity,
  CourseCoordinatorEntity,
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
  DefineCourseBlockDto,
  UpdateCourseBlockDto,
} from '../dto';
import { ICourseDetailResponse, ICourseResponse } from '../response';
import { CourseBlockEntity } from 'entities/course-block.entity';
import { CourseTransferService } from './course-transfer.service';
import { CoordinatorService } from 'coordinator/coordinator.service';
import { CourseGridViewEntity } from 'entities/course-grid-view.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(CourseBlockEntity)
    private readonly courseBlocksRepository: Repository<CourseBlockEntity>,
    @InjectRepository(CourseCoordinatorEntity)
    private readonly courseCoordinatorRepository: Repository<CourseCoordinatorEntity>,
    @InjectRepository(CourseGridViewEntity)
    private readonly courseGridViewRepository: Repository<CourseGridViewEntity>,
    private readonly userService: UserService,
    private readonly courseTransferService: CourseTransferService,
    private readonly coordinatorService: CoordinatorService,
  ) {}

  async createCourse(
    userId: string,
    bodyDto: CreateCourseDto,
  ): Promise<ICourseResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.role !== UserRoleEnum.ADMIN && !bodyDto.coordinatorIds.length) {
      bodyDto.coordinatorIds = [userId];
    }

    const { semesterId, departmentId, coordinatorIds, name, creditHours } =
      bodyDto;

    let course = {};

    course = {
      ...course,
      name,
      creditHours,
      department: { id: departmentId } as CollegeDepartmentEntity,
      semester: { id: semesterId } as SemesterEntity,
    };

    // if (coordinatorIds.length) {
    //   course = {
    //     ...course,
    //     coordinator: { id: coordinatorId } as UserEntity,
    //   };
    // }

    const newCourse = await this.courseRepository.save(course);

    await Promise.all(
      coordinatorIds.map(async (coordinatorId) => {
        await this.courseCoordinatorRepository.save({
          course: { id: newCourse.id } as CourseEntity,
          coordinator: { id: coordinatorId } as UserEntity,
        });
      }),
    );

    return this.transformToResponse(newCourse);
  }

  async defineCourseBlock(bodyDto: DefineCourseBlockDto) {
    const { courseId, blockType } = bodyDto;

    await this.courseRepository.update(
      { id: courseId },
      { blockType: blockType },
    );

    return { message: 'Course block defined successfully.', blockType };
  }

  async addStudent(bodyDto: AddStudentDto): Promise<ISuccessMessageResponse> {
    const studentFromEmail = await this.userService.findUserByEmail(
      bodyDto.email.trim().toLowerCase(),
    );
    const studentFromStudentId = await this.userService.findUserByStudentId(
      bodyDto.studentId.trim().toLowerCase(),
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
        email: bodyDto.email.trim().toLowerCase(),
        password: 'student',
        role: UserRoleEnum.STUDENT,
        studentId: bodyDto.studentId.trim().toLowerCase(),
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
        courseCoordinator: {
          coordinator: {
            id: userId,
          },
        },
      };
    }
    const allCourses = await this.courseRepository.find({
      where: whereClause,
      loadEagerRelations: false,
      relations: [
        'department',
        'semester',
        'courseCoordinator',
        'courseCoordinator.coordinator',
      ],
    });

    return allCourses.map((course) => this.transformToDetailResponse(course));
  }

  async findAllCoursesForCoordinatorDepartment(coordinatorId: string) {
    try {
      const coordinatorDepartment =
        await this.coordinatorService.findCoordinatorDepartment(coordinatorId);

      const coordinatorDepartmentId = coordinatorDepartment.departmentId;

      const allCoursesForDepartment = await this.courseRepository.find({
        where: { department: { id: coordinatorDepartmentId } },
        loadEagerRelations: false,
        relations: ['semester', 'department', 'coordinator'],
      });

      const transformedResponse = allCoursesForDepartment.map((course) => {
        return this.transformToDetailResponse(course);
      });

      return transformedResponse;
    } catch (err) {
      throw err;
    }
  }

  async findAllCourses(departmentId: string): Promise<CourseEntity[]> {
    try {
      return await this.courseRepository.find({
        where: {
          department: {
            id: departmentId,
          },
        },
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
      relations: [
        'blocks',
        'department',
        'semester',
        'courseCoordinator',
        'courseCoordinator.coordinator',
      ],
    });

    return this.transformToDetailResponse(course);
  }

  async findCourseStudents(courseId: string): Promise<IUserResponse[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      loadEagerRelations: false,
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
        email: email.trim().toLowerCase(),
        name,
        studentId: studentId.trim().toLowerCase(),
      };
    });

    return allStudents;
  }

  async updateCourse(
    courseId: string,
    bodyDto: CreateCourseDto,
  ): Promise<ICourseDetailResponse> {
    const { semesterId, departmentId, coordinatorIds, ...body } = bodyDto;

    let updateBody = {};

    updateBody = {
      ...updateBody,
      ...body,
      department: { id: departmentId } as CollegeDepartmentEntity,
      semester: { id: semesterId } as SemesterEntity,
    };

    if (coordinatorIds.length) {
      await this.courseCoordinatorRepository.delete({
        course: { id: courseId },
      });

      await Promise.all(
        coordinatorIds.map(async (coordinatorId) => {
          await this.courseCoordinatorRepository.save({
            course: { id: courseId } as CourseEntity,
            coordinator: { id: coordinatorId } as UserEntity,
          });
        }),
      );
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
    const { id, name, creditHours } = entity;
    return {
      id,
      name,
      creditHours,
    };
  }

  private transformToDetailResponse(
    entity: CourseEntity,
  ): ICourseDetailResponse {
    const {
      id,
      name,
      creditHours,
      courseCoordinator,
      department,
      semester,
      blockType,
      blocks,
    } = entity;

    const allCoordiantors = courseCoordinator.map((coordinator) => {
      return {
        id: coordinator.coordinator.id,
        name: coordinator.coordinator.name,
        email: coordinator.coordinator.email?.trim().toLowerCase(),
      };
    });

    const response = {
      id,
      name,
      creditHours,
      blockType,
      allCoordiantors,
      department: { id: department.id, name: department.name },
      semester: {
        id: semester.id,
        semester: semester.semester,
        startYear: semester.startYear,
        endYear: semester.endYear,
      },
      totalBlocks: blocks?.length || 0,
    };

    return response;
  }

  public async addBlocks(body: CreateBlockDto) {
    const course = await this.courseRepository.findOne({
      where: { id: body.courseId },
      loadEagerRelations: false,
    });

    const courseBlockType = course.blockType || 'rotating';

    // if (!courseBlockType) {
    //   throw new BadRequestException(
    //     'No block type is defined for the course. Define course block type first.',
    //   );
    // }

    if (courseBlockType === 'rotating') {
      // check if all the startsFrom and endsAt dates are same for the payload or not
      const startsFrom = body.blocks[0].startsFrom;
      const endsAt = body.blocks[0].endsAt;

      for (let i = 1; i < body.blocks.length; i++) {
        const block = body.blocks[i];
        if (block.startsFrom !== startsFrom || block.endsAt !== endsAt) {
          throw new BadRequestException(
            'All the block dates should be same for rotating block type.',
          );
        }
      }
    }

    const courseId = body.courseId;
    await Promise.all(
      body.blocks.map(async (block) => {
        const { startsFrom, endsAt, duration, name, capacity } = block;

        await this.courseBlocksRepository.save({
          name,
          capacity,
          startsFrom,
          endsAt,
          duration,
          course: { id: courseId } as CourseEntity,
        });
      }),
    );

    return { message: 'Blocks added successfully.' };
  }

  public async getCourseBlocks(courseId: string) {
    const courseInfo = await this.courseRepository.findOne({
      where: { id: courseId },
      loadEagerRelations: false,
    });

    const allBlocks = await this.courseBlocksRepository.find({
      loadEagerRelations: false,
      where: { course: { id: courseId } },
      order: {
        name: 'ASC',
      },
    });

    const mappedCourseBlocks = allBlocks.map((block) => {
      const { name, duration, capacity, startsFrom, endsAt, id } = block;

      return {
        id,
        name,
        duration,
        capacity,
        startsFrom,
        endsAt,
        courseBlockType: courseInfo.blockType,
      };
    });

    return mappedCourseBlocks;
  }

  public async updateBlock(blockId: string, body: UpdateCourseBlockDto) {
    const { name, capacity, startsFrom, endsAt, duration } = body;

    await this.courseBlocksRepository.update(
      { id: blockId },
      { name, capacity, startsFrom, endsAt, duration },
    );

    const blockInfo = await this.courseBlocksRepository.findOne({
      where: {
        id: blockId,
      },
      loadEagerRelations: false,
      relations: ['course'],
    });

    const courseBlockType = blockInfo.course.blockType;

    if (courseBlockType === 'rotating') {
      await this.courseBlocksRepository.update(
        { course: { id: blockInfo.course.id } },
        {
          startsFrom,
          endsAt,
          duration,
        },
      );
    }

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

  public async importSettingsToAllBlocks(courseId: string) {
    try {
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['blocks'],
      });

      await Promise.all(
        course.blocks.map(async (block) => {
          await this.courseTransferService.importCourseSetting({
            courseId,
            blockId: block.id,
            transferProperties: ['trainingSites', 'timeslots'],
          });
        }),
      );

      return {
        message: 'Course settings imported to all blocks successfully.',
      };
    } catch (err) {
      console.log('err here', err);
      throw new BadRequestException('bad request');
    }
  }

  public async saveCourseGridView(body: { courseId: string; layout: any }) {
    const { courseId, layout } = body;

    const courseGridView = await this.courseGridViewRepository.findOne({
      where: { course: { id: courseId } },
    });

    if (courseGridView) {
      await this.courseGridViewRepository.update(
        { course: { id: courseId } },
        { layout },
      );
    } else {
      await this.courseGridViewRepository.save({
        course: { id: courseId } as CourseEntity,
        layout,
      });
    }

    return { message: 'Course grid view saved successfully.' };
  }

  public async getCourseGridView(
    courseId: string,
  ): Promise<CourseGridViewEntity> {
    return await this.courseGridViewRepository.findOne({
      where: { course: { id: courseId } },
    });
  }
}
