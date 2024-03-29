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
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
} from 'course/dto';
import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteService } from './course-training-site.service';
import { TrainingSiteTimeSlotService } from 'training-time-slot/training-time-slot.service';
import { PlacementService } from 'placement/placement.service';

@Injectable()
export class CourseTransferService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
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
