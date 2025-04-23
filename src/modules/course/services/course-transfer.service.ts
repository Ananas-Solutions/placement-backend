import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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

      // Process one feature at a time instead of a single transaction to reduce memory usage
      if (transferProperties.includes('trainingSites')) {
        await this.transferTrainingSitesStreamlined(
          sourceCourseId,
          destinationCourseId,
          transferProperties,
        );
      }

      if (transferProperties.includes('students')) {
        await this.transferStudentsStreamlined(
          sourceCourseId,
          destinationCourseId,
        );
      }

      return { message: 'Course setting transfer is completed successfully.' };
    } catch (err) {
      console.error('Transfer course settings error:', err);
      throw new BadRequestException('Failed to transfer course settings');
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

  private async transferTrainingSitesStreamlined(
    sourceCourseId: string,
    destinationCourseId: string,
    transferProperties: string[],
  ) {
    // Fetch only training sites first to reduce memory load
    const course = await this.courseRepository.findOne({
      where: { id: sourceCourseId },
      relations: ['trainingSite', 'trainingSite.departmentUnit'],
      loadEagerRelations: false,
    });

    if (!course?.trainingSite?.length) return;

    // Process training sites one at a time
    for (const site of course.trainingSite) {
      const departmentUnitId = site.departmentUnit.id;

      const { trainingSiteId } =
        await this.courseTrainingSiteService.createTrainingSite(
          {
            courseId: destinationCourseId,
            departmentUnitId,
          },
          true,
        );

      // Only proceed with timeslots if needed
      if (transferProperties.includes('timeslots')) {
        await this.processTimeslotsForSite(
          sourceCourseId,
          site.id,
          trainingSiteId,
          transferProperties.includes('placement'),
        );
      }
    }
  }

  private async processTimeslotsForSite(
    sourceCourseId: string,
    siteId: string,
    destTrainingSiteId: string,
    includePlacements: boolean,
  ) {
    // Fetch timeslots for this specific site only
    const timeslots = await this.timeslotService.findBySiteId(siteId);
    if (!timeslots?.length) return;

    // Process in smaller batches (5 at a time)
    const batchSize = 5;
    for (let i = 0; i < timeslots.length; i += batchSize) {
      const batch = timeslots.slice(i, i + batchSize);

      for (const slot of batch) {
        const { startTime, endTime, capacity, day } = slot;

        const { newTimeSlots } = await this.timeslotService.save({
          timeslots: [{ startTime, endTime, capacity, day }],
          trainingSiteId: destTrainingSiteId,
        });

        // Handle placements if needed - process in series to reduce memory pressure
        if (includePlacements) {
          await this.processPlacementsForTimeslot(
            slot.id,
            newTimeSlots[0].id,
            destTrainingSiteId,
          );
        }
      }
    }
  }

  private async processPlacementsForTimeslot(
    sourceTimeslotId: string,
    destTimeslotId: string,
    trainingSiteId: string,
  ) {
    // Fetch placements in batches
    const placements = await this.placementService.findByTimeslotId(
      sourceTimeslotId,
    );
    if (!placements?.length) return;

    const studentIds = placements.map((p) => p.student.id);

    // Process in even smaller chunks to minimize memory impact
    const chunkSize = 20;
    for (let i = 0; i < studentIds.length; i += chunkSize) {
      const chunk = studentIds.slice(i, i + chunkSize);

      await this.placementService.assignPlacment({
        timeSlotIds: [destTimeslotId],
        trainingSiteId,
        studentIds: chunk,
      });
    }
  }

  private async transferStudentsStreamlined(
    sourceCourseId: string,
    destinationCourseId: string,
  ) {
    // Fetch students in chunks instead of all at once
    const pageSize = 100;
    let hasMore = true;
    let page = 0;

    while (hasMore) {
      const students = await this.studentCourseRepository.find({
        where: { course: { id: sourceCourseId } },
        relations: ['student'],
        take: pageSize,
        skip: page * pageSize,
      });

      if (students.length === 0) {
        hasMore = false;
        continue;
      }

      const studentIds = students.map((s) => s.student.id);

      // Find existing students in chunks
      const existingStudents = await this.studentCourseRepository.find({
        where: {
          course: { id: destinationCourseId },
          student: { id: In(studentIds) },
        },
        select: ['student'],
      });

      const existingIds = new Set(existingStudents.map((e) => e.student.id));
      const newStudentIds = studentIds.filter((id) => !existingIds.has(id));

      // Insert in smaller batches to reduce memory usage
      if (newStudentIds.length > 0) {
        const insertBatchSize = 50;
        for (let i = 0; i < newStudentIds.length; i += insertBatchSize) {
          const batch = newStudentIds.slice(i, i + insertBatchSize);

          const entities = batch.map((id) => ({
            course: { id: destinationCourseId } as CourseEntity,
            student: { id } as UserEntity,
          }));

          await this.studentCourseRepository.insert(entities);
        }
      }

      page++;
    }
  }
}
