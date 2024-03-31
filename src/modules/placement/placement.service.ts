import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { groupBy } from 'lodash';

import { TrainingDaysEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import {
  CourseTrainingSiteEntity,
  PlacementEntity,
  TrainingTimeSlotEntity,
  UserEntity,
} from 'entities/index.entity';
import { StudentCourseService } from 'student-course/student-course.service';

import { StudentPlacementDto } from './dto';
import {
  IStudentAvailabilityInterface,
  IStudentTrainingSites,
  ITrainingSiteStudents,
} from './interface';
import { CourseBlockTrainingSiteEntity } from 'entities/block-training-site.entity';
import { BlockTrainingTimeSlotEntity } from 'entities/block-training-time-slot.entity';
import { CourseBlockEntity } from 'entities/course-block.entity';

@Injectable()
export class PlacementService {
  constructor(
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSite: Repository<CourseTrainingSiteEntity>,
    @InjectRepository(CourseBlockTrainingSiteEntity)
    private readonly courseBlockTrainingSite: Repository<CourseBlockTrainingSiteEntity>,
    @InjectRepository(CourseBlockEntity)
    private readonly courseBlock: Repository<CourseBlockEntity>,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async assignPlacment(bodyDto: StudentPlacementDto): Promise<any> {
    try {
      const {
        trainingSiteId,
        timeSlotIds,
        blockTimeSlotIds,
        blockTrainingSiteId,
      } = bodyDto;

      if (trainingSiteId && timeSlotIds) {
        await Promise.all(
          timeSlotIds.map((timeslotId) => {
            bodyDto.studentIds.map(async (studentId) => {
              const existingPlacement = await this.placementRepository.findOne({
                where: {
                  student: { id: studentId },
                  trainingSite: { id: trainingSiteId },
                  timeSlot: { id: timeslotId },
                },
              });

              if (existingPlacement) {
                return;
              }

              return await this.placementRepository.save({
                student: { id: studentId } as UserEntity,
                trainingSite: {
                  id: trainingSiteId,
                } as CourseTrainingSiteEntity,
                timeSlot: { id: timeslotId } as TrainingTimeSlotEntity,
              });
            });
          }),
        );
      }

      if (blockTimeSlotIds && blockTrainingSiteId) {
        await Promise.all(
          blockTimeSlotIds.map((timeslotId) => {
            bodyDto.studentIds.map(async (studentId) => {
              const existingPlacement = await this.placementRepository.findOne({
                where: {
                  student: { id: studentId },
                  blockTrainingSite: { id: blockTrainingSiteId },
                  blockTimeSlot: { id: timeslotId },
                },
              });

              if (existingPlacement) {
                return;
              }

              return await this.placementRepository.save({
                student: { id: studentId } as UserEntity,
                blockTrainingSite: {
                  id: blockTrainingSiteId,
                } as CourseBlockTrainingSiteEntity,
                blockTimeSlot: {
                  id: timeslotId,
                } as BlockTrainingTimeSlotEntity,
              });
            });
          }),
        );
      }

      return { message: 'Student assigned to training placement succesfully.' };
    } catch (err) {
      throw err;
    }
  }

  async autoAssignPlacement(courseId: string) {
    // find if course has blocks or not
    const courseBlocks = await this.courseBlock.find({
      where: { course: { id: courseId } },
    });

    const hasCourseBlocks = courseBlocks.length > 0;

    if (hasCourseBlocks) {
      // act accordingly
    }

    if (!hasCourseBlocks) {
      const courseTrainingSites = await this.courseTrainingSite.find({
        where: { course: { id: courseId } },
        loadEagerRelations: false,
        relations: ['trainingSite', 'trainingSite.timeSlots'],
      });

      const courseStudents = await this.studentCourseService.findCourseStudents(
        courseId,
      );

      await Promise.all(
        courseStudents.map(async (student) => {
          const studentPlacement = await this.findStudentPlacement(
            student.id,
            courseId,
          );

          if (studentPlacement.length > 0) {
            return;
          }

          await Promise.all(
            courseTrainingSites.map(async (courseTrainingSite) => {
              const { id, timeslots } = courseTrainingSite;

              await Promise.all(
                timeslots.map(async (timeSlot) => {
                  const existingPlacement =
                    await this.placementRepository.findOne({
                      where: {
                        student: { id: student.id },
                        trainingSite: { id: id },
                        timeSlot: { id: timeSlot.id },
                      },
                    });

                  if (existingPlacement) {
                    return;
                  }

                  return await this.placementRepository.save({
                    student: { id: student.id } as UserEntity,
                    trainingSite: {
                      id,
                    } as CourseTrainingSiteEntity,
                    timeSlot: { id: timeSlot.id } as TrainingTimeSlotEntity,
                  });
                }),
              );
            }),
          );
        }),
      );
    }

    return { message: 'Placement has been done automatically.' };
  }

  async findStudentTrainingSite(
    studentId: string,
  ): Promise<IStudentTrainingSites[]> {
    try {
      const studentTrainingSites = await this.placementRepository.find({
        where: { student: { id: studentId } },
        loadEagerRelations: false,
        relations: [
          'trainingSite',
          'trainingSite.departmentUnit',
          'trainingSite.departmentUnit.department',
          'trainingSite.departmentUnit.department.hospital',
          'trainingSite.departmentUnit.department.hospital.authority',
          'timeSlot',
        ],
      });
      const mappedResult = studentTrainingSites.map((studentPlacement) => {
        const { trainingSite, timeSlot } = studentPlacement;
        const { departmentUnit } = trainingSite;
        return {
          name: departmentUnit.name,
          authority: departmentUnit.department.hospital.authority.name,
          hospital: departmentUnit.department.hospital.name,
          department: departmentUnit.department.name,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          day: timeSlot.day,
        };
      });
      return mappedResult;
    } catch (err) {
      throw err;
    }
  }

  async findStudentTrainingForParticularDay(
    studentId: string,
    day: TrainingDaysEnum,
  ): Promise<PlacementEntity[]> {
    try {
      return await this.placementRepository.find({
        where: { student: { id: studentId }, timeSlot: { day } },
        loadEagerRelations: false,
        relations: ['trainingSite', 'trainingSite.departmentUnit', 'timeSlot'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findTrainingSiteStudents(
    trainingSiteId: string,
    timeSlotId: string,
  ): Promise<ITrainingSiteStudents[]> {
    const studentsPlacement = await this.placementRepository.find({
      where: {
        trainingSite: { id: trainingSiteId },
        timeSlot: { id: timeSlotId },
      },
      loadEagerRelations: false,
      relations: ['student', 'timeSlot'],
    });

    const mappedTrainingSiteStudents = studentsPlacement.map(
      (studentPlacement) => {
        const { id, student, timeSlot } = studentPlacement;
        return {
          placementId: id,
          student: {
            id: student.id,
            studentId: student.studentId,
            name: student.name,
            email: student.email,
          },
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          day: timeSlot.day,
        };
      },
    );

    return mappedTrainingSiteStudents;
  }

  async findBlockTrainingSiteStudents(
    blockTrainingSiteId: string,
    blockTimeSlotId: string,
  ): Promise<ITrainingSiteStudents[]> {
    const studentsPlacement = await this.placementRepository.find({
      where: {
        blockTimeSlot: { id: blockTimeSlotId },
        blockTrainingSite: { id: blockTrainingSiteId },
      },
      loadEagerRelations: false,
      relations: ['student', 'blockTimeSlot'],
    });

    const mappedTrainingSiteStudents = studentsPlacement.map(
      (studentPlacement) => {
        const { id, student, blockTimeSlot } = studentPlacement;
        return {
          placementId: id,
          student: {
            id: student.id,
            studentId: student.studentId,
            name: student.name,
            email: student.email,
          },
          startTime: blockTimeSlot.startTime,
          endTime: blockTimeSlot.endTime,
          day: blockTimeSlot.day,
        };
      },
    );

    return mappedTrainingSiteStudents;
  }

  async groupTrainingSiteStudentsByDay(trainingSiteId: string): Promise<any> {
    try {
      const placements = await this.placementRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
        loadEagerRelations: false,
        relations: ['student', 'timeSlot'],
      });

      const mappedPlacements = placements.map((p) => {
        return {
          studentId: p.student.id,
          name: p.student.name,
          timeslotId: p.timeSlot.id,
          day: p.timeSlot.day,
          startTime: p.timeSlot.startTime,
          endTime: p.timeSlot.endTime,
        };
      });

      const mappedResult = groupBy(mappedPlacements, 'day');

      return mappedResult;
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlotStudents(timeSlotId: string): Promise<PlacementEntity[]> {
    try {
      return await this.placementRepository.find({
        where: { timeSlot: { id: timeSlotId } },
        loadEagerRelations: false,
        relations: ['trainingSite', 'trainingSite.departmentUnit', 'student'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findBlockTimeSlotStudents(
    blockTimeslotId: string,
  ): Promise<PlacementEntity[]> {
    try {
      return await this.placementRepository.find({
        where: { blockTimeSlot: { id: blockTimeslotId } },
        loadEagerRelations: false,
        relations: [
          'blockTrainingSite',
          'blockTrainingSite.departmentUnit',
          'student',
        ],
      });
    } catch (err) {
      throw err;
    }
  }

  async findStudentsAvailability(
    trainingSiteId: string,
  ): Promise<IStudentAvailabilityInterface[]> {
    try {
      //finding which course does the trainingsite id belongs to;
      const courseTrainingSite = await this.courseTrainingSite.findOne({
        where: { id: trainingSiteId },
        loadEagerRelations: false,
        relations: ['course'],
      });
      const course = courseTrainingSite.course;

      // finding all students under that particular course
      const courseStudents = await this.studentCourseService.findCourseStudents(
        course.id,
      );

      const allResults = await Promise.all(
        courseStudents.map(async (student: UserEntity) => {
          const studentTrainingSitePlacement =
            await this.findStudentPlacementByStudentId(student.id);

          return {
            id: student.id,
            email: student.email,
            name: student.name,
            isStudentPlaced:
              studentTrainingSitePlacement.length > 0 ? true : false,
          };
        }),
      );

      return allResults;
    } catch (err) {
      throw err;
    }
  }

  async findBlockStudentsAvailability(
    blockTrainingSiteId: string,
  ): Promise<IStudentAvailabilityInterface[]> {
    try {
      const blockTrainingSite = await this.courseBlockTrainingSite.findOne({
        where: { id: blockTrainingSiteId },
        loadEagerRelations: false,
        relations: ['block', 'block.course'],
      });

      const block = blockTrainingSite.block;

      const blockStudents =
        await this.studentCourseService.findCourseBlockStudents(block.id);

      const allResults = await Promise.all(
        blockStudents.map(async (student: UserEntity) => {
          const studentTrainingSitePlacement =
            await this.findStudentPlacementByStudentId(student.id);

          return {
            id: student.id,
            email: student.email,
            name: student.name,
            isStudentPlaced:
              studentTrainingSitePlacement.length > 0 ? true : false,
          };
        }),
      );

      return allResults;
    } catch (err) {
      throw err;
    }
  }

  async removeStudentFromTrainingSite(
    placementId: string,
  ): Promise<ISuccessMessageResponse> {
    const placement = await this.placementRepository.findOne({
      where: { id: placementId },
    });
    await this.placementRepository.softRemove(placement);

    return { message: 'Student removed from placement successfully.' };
  }

  private async findStudentPlacement(studentId: string, courseId: string) {
    return await this.placementRepository.find({
      where: {
        student: { id: studentId },
        trainingSite: { course: { id: courseId } },
      },
      loadEagerRelations: false,
    });
  }

  private async findStudentPlacementByStudentId(studentId: string) {
    return await this.placementRepository.find({
      where: {
        student: { id: studentId },
      },
    });
  }
}
