import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CourseEntity,
  StudentCourseEntity,
  UserEntity,
} from 'entities/index.entity';
import {
  ImportCourseSettingDto,
  TransferAndShuffleCourseSettingDto,
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
} from 'course/dto';
import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteService } from './course-training-site.service';
import { TrainingSiteTimeSlotService } from 'training-time-slot/training-time-slot.service';
import { PlacementService } from 'placement/placement.service';
import { CourseBlockEntity } from 'entities/course-block.entity';

@Injectable()
export class CourseTransferService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(CourseBlockEntity)
    private readonly courseBlocksRepository: Repository<CourseBlockEntity>,
    private readonly courseTrainingSiteService: CourseTrainingSiteService,
    private readonly timeslotService: TrainingSiteTimeSlotService,
    private readonly placementService: PlacementService,
  ) {}

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

                    const mappedSlotStudents = slotStudents.map(
                      ({ student }) => student.id,
                    );

                    const timeslot = newTimeSlots[0];
                    const timeslotId = timeslot.id;

                    await this.placementService.assignPlacment({
                      timeSlotIds: [timeslotId],
                      trainingSiteId: trainingSiteId,
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
            const existingStudent = await this.studentCourseRepository.findOne({
              where: {
                course: { id: destinationCourseId },
                student: { id: student.id },
              },
            });

            if (existingStudent) {
              return;
            }

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

  public async transferAndShuffleCourseSettings(
    body: TransferAndShuffleCourseSettingDto,
  ) {
    try {
      const { sourceCourseId, destinationCourseId } = body;

      const sourceCourseData = await this.courseRepository.findOne({
        where: {
          id: sourceCourseId,
        },
        loadEagerRelations: false,
        relations: ['student', 'student.student', 'blocks'],
      });

      if (sourceCourseData.blocks.length === 0) {
        await this.transferCourseSetting({
          sourceCourseId,
          destinationCourseId,
          transferProperties: ['trainingSites', 'timeslots', 'students'],
        });
      }

      if (sourceCourseData.blocks.length !== 0) {
        try {
          const students = sourceCourseData.student;

          await Promise.all(
            students.map(async ({ student }) => {
              const existingStudent =
                await this.studentCourseRepository.findOne({
                  where: {
                    course: { id: destinationCourseId },
                    student: { id: student.id },
                  },
                });

              if (existingStudent) {
                return;
              }

              await this.studentCourseRepository.save({
                course: { id: destinationCourseId } as CourseEntity,
                student: { id: student.id } as UserEntity,
              });
            }),
          );

          const courseBlocks = sourceCourseData.blocks;

          await Promise.all(
            courseBlocks.map(async (block) => {
              const { name, startsFrom, endsAt, capacity, duration } = block;

              await this.courseBlocksRepository.save({
                name,
                startsFrom,
                endsAt,
                capacity,
                duration,
                course: { id: destinationCourseId } as CourseEntity,
              });
            }),
          );
        } catch (error) {
          console.log('error', error);
        }

        try {
          const destinationBlocks = await this.courseBlocksRepository.find({
            where: {
              course: { id: destinationCourseId },
            },
          });

          for (let i = 0; i < destinationBlocks.length; i++) {
            const block = destinationBlocks[i];

            const { id: blockId } = block;

            const sourceCourseBlockIndex =
              i + 1 === sourceCourseData.blocks.length ? 0 : i + 1;

            const sourceCourseBlock =
              sourceCourseData.blocks[sourceCourseBlockIndex];

            const blockStudents = await this.studentCourseRepository.find({
              where: {
                block: { id: sourceCourseBlock.id },
              },
              loadEagerRelations: false,
              relations: ['student'],
            });

            for (let j = 0; j < blockStudents.length; j++) {
              const { student } = blockStudents[j];
              await this.studentCourseRepository.update(
                {
                  course: { id: destinationCourseId },
                  student: { id: student.id },
                },
                {
                  block: { id: blockId } as CourseBlockEntity,
                },
              );
            }
          }
        } catch (error) {
          console.log('error', error);
        }
      }

      return {
        message: 'Course setting and shuffle is completed successfully.',
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  public async importCourseSetting(body: ImportCourseSettingDto) {
    try {
      const { courseId, blockId } = body;
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        loadEagerRelations: false,
        relations: [
          'trainingSite',
          'trainingSite.departmentUnit',
          'trainingSite.timeslots',
        ],
      });

      if (body.transferProperties.includes('trainingSites')) {
        const trainingSites = course.trainingSite;
        await Promise.all(
          trainingSites.map(async (site) => {
            const departmentUnitId = site.departmentUnit.id;
            const { trainingSiteId } =
              await this.courseTrainingSiteService.createBlockTrainingSite({
                courseId,
                departmentUnitId,
                blockId,
              });

            if (body.transferProperties.includes('timeslots')) {
              const timeslots = site.timeslots;

              await Promise.all(
                timeslots.map(async (slot) => {
                  const { startTime, endTime, capacity, day } = slot;
                  await this.timeslotService.saveBlockTimeSlots({
                    timeslots: [{ startTime, endTime, capacity, day }],
                    blockTrainingSiteId: trainingSiteId,
                  });
                }),
              );
            }
          }),
        );
      }

      return { message: 'Course setting import is completed successfully.' };
    } catch (err) {
      console.log('err here', err);
      throw new BadRequestException('bad request');
    }
  }
}
