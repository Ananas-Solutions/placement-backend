import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { CourseEntity } from 'entities/courses.entity';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserEntity } from 'entities/user.entity';

import {
  AssignCoursesToStudentDto,
  AssignStudentsToCourseDto,
  AutoAssignStudentsToBlockDto,
} from './dto';
import { ICourseStudentResponse, IStudentCourseResponse } from './response';
import { CourseBlockEntity } from 'entities/course-block.entity';
import { PlacementEntity } from 'entities/placement.entity';

@Injectable()
export class StudentCourseService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseBlockEntity)
    private readonly courseBlockRepository: Repository<CourseBlockEntity>,
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
  ) {}

  async assignStudents(
    body: AssignStudentsToCourseDto,
  ): Promise<ISuccessMessageResponse> {
    const { courseId, studentsId, blockId } = body;
    await Promise.all(
      studentsId.map(async (studentId: any) => {
        const studentCourse = await this.studentCourseRepository.findOne({
          where: { student: { id: studentId }, course: { id: courseId } },
        });

        if (studentCourse) {
          return;
        }

        return await this.studentCourseRepository.save({
          course: { id: courseId } as CourseEntity,
          student: { id: studentId } as UserEntity,
          ...(blockId && { block: { id: blockId } as CourseBlockEntity }),
        });
      }),
    );

    return { message: 'Students assigned to course successfully.' };
  }

  async assignCourses(
    body: AssignCoursesToStudentDto,
  ): Promise<ISuccessMessageResponse> {
    await Promise.all(
      body.coursesId.map(async (courseId: string) => {
        await this.studentCourseRepository.save({
          course: { id: courseId },
          student: { id: body.studentId },
        });
      }),
    );

    return { message: 'Courses assigend to student successfully.' };
  }

  async autoAssignStudentsToBlocks(body: AutoAssignStudentsToBlockDto) {
    const { courseId } = body;

    // finding all the blocks of the course
    const courseBlocks = await this.courseBlockRepository.find({
      where: { course: { id: courseId } },
    });

    const studentCourses = await this.studentCourseRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
    });

    const totalStudentsInCourse = studentCourses.length;

    // assign students to blocks
    let studentIndex = 0;
    for (let i = 0; i < courseBlocks.length; i++) {
      const block = courseBlocks[i];
      for (let j = 0; j < block.capacity; j++) {
        if (studentIndex === totalStudentsInCourse) {
          break;
        }
        const studentCourse = studentCourses[studentIndex];
        studentCourse.block = block;

        await this.studentCourseRepository.save(studentCourse);
        studentIndex++;
      }
    }

    return { message: 'Student auto assign completed successfully.' };
  }

  async findStudentCourses(
    studentId: string,
  ): Promise<IStudentCourseResponse[]> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { student: { id: studentId } },
      loadEagerRelations: false,
      relations: ['course', 'block'],
    });
    const allCourses = studentCourses.map((studentCourse) =>
      this.transformToStudentCourse(studentCourse),
    );

    return allCourses;
  }

  async findStudentCourseById(studentId: string, courseId: string) {
    const studentCourse = await this.studentCourseRepository.findOne({
      where: { student: { id: studentId }, course: { id: courseId } },
      loadEagerRelations: false,
      relations: [
        'course',
        'course.courseCoordinator',
        'course.courseCoordinator.coordinator',
        'block',
      ],
    });

    if (!studentCourse) {
      throw new ConflictException('No course found for this student');
    }

    const {
      course: { courseCoordinator },
      block,
    } = studentCourse;

    const allCourseCoordinators = courseCoordinator.map((coordinator) => {
      return {
        id: coordinator.coordinator.id,
        name: coordinator.coordinator.name,
        email: coordinator.coordinator.email,
      };
    });

    delete studentCourse.course.courseCoordinator;

    const transformedResponse = {
      course: studentCourse.course,
      block,
      coordinator: allCourseCoordinators,
    };

    return transformedResponse;
  }

  async findCourseStudents(
    courseId: string,
  ): Promise<ICourseStudentResponse[]> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { course: { id: courseId } },
      loadEagerRelations: false,
      relations: ['student', 'student.studentProfile'],
    });
    const users = await Promise.all(
      studentCourses.map((studentCourse) =>
        this.transformToCourseStudent(studentCourse, courseId, undefined),
      ),
    );

    return users;
  }

  async findCourseBlockStudents(
    blockId: string,
  ): Promise<ICourseStudentResponse[]> {
    const studentCourses = await this.studentCourseRepository.find({
      where: { block: { id: blockId } },
      loadEagerRelations: false,
      relations: ['student', 'student.studentProfile'],
    });
    const users = await Promise.all(
      studentCourses.map((studentCourse) =>
        this.transformToCourseStudent(studentCourse, undefined, blockId),
      ),
    );

    return users;
  }

  async getAvailableStudentsForBlock(blockId: string) {
    const blockInfo = await this.courseBlockRepository.findOne({
      where: {
        id: blockId,
      },
      relations: ['course'],
    });

    const availableStudents = await this.studentCourseRepository.find({
      where: {
        course: { id: blockInfo.course.id },
        block: IsNull(),
      },
      relations: ['student'],
    });

    const blockStudents = await this.studentCourseRepository.count({
      where: {
        block: {
          id: blockId,
        },
      },
      relations: ['student'],
    });

    const getAvailableStudentsForBlock = availableStudents.map((student) =>
      this.transformToCourseStudent(student),
    );

    return {
      remainingBlockCapacity: blockInfo.capacity - blockStudents,
      availableStudents: getAvailableStudentsForBlock,
    };
  }

  async deleteBlockStudent(
    blockId: string,
    studentId: string,
  ): Promise<ISuccessMessageResponse> {
    const existingStudent = await this.studentCourseRepository.findOne({
      where: { student: { id: studentId }, block: { id: blockId } },
    });

    if (!existingStudent) {
      throw new ConflictException('No student found for this course');
    }
    await this.studentCourseRepository.update(
      { id: existingStudent.id },
      { block: null },
    );

    return { message: 'Student removed from the block successfully' };
  }

  async deleteCourseStudent(
    courseId: string,
    studentId: string,
  ): Promise<ISuccessMessageResponse> {
    const existingStudent = await this.studentCourseRepository.findOne({
      where: { student: { id: studentId }, course: { id: courseId } },
    });
    if (!existingStudent) {
      throw new ConflictException('No student found for this course');
    }
    await this.studentCourseRepository.softRemove(existingStudent);

    return { message: 'Student removed from the course successfully' };
  }

  private transformToStudentCourse(
    entity: StudentCourseEntity,
  ): IStudentCourseResponse {
    const { course, block } = entity;

    return {
      id: course.id,
      name: course.name,
      blockId: block?.id,
      blockName: block?.name,
    };
  }

  private async transformToCourseStudent(
    entity: StudentCourseEntity,
    courseId?: string,
    blockId?: string,
  ) {
    const { student } = entity;

    // find whether that student is placed inside that course or not
    let studentPlacementOnCourseLevel;
    let studentOnBlock;
    if (courseId) {
      studentPlacementOnCourseLevel = await this.placementRepository.find({
        where: [
          {
            trainingSite: { course: { id: courseId } },
            student: { id: student.id },
          },
          {
            blockTrainingSite: { block: { course: { id: courseId } } },
            student: { id: student.id },
          },
        ],
      });

      // check if student is inside block or not
      studentOnBlock = await this.studentCourseRepository.find({
        where: {
          student: { id: student.id },
          block: { course: { id: courseId } },
        },
        relations: ['block'],
      });
    }

    let studentPlacementOnBlockLevel;
    if (blockId) {
      studentPlacementOnBlockLevel = await this.placementRepository.find({
        where: {
          blockTrainingSite: { block: { id: blockId } },
          student: { id: student.id },
        },
      });
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      placement: {
        coursePlacementCount: studentPlacementOnCourseLevel?.length,
        blockPlacementCount: studentPlacementOnBlockLevel?.length,
      },
      blocks: studentOnBlock?.map((block) => block.block.name),
    };
  }
}
