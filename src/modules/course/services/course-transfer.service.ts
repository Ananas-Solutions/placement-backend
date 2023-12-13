import { BadRequestException, Injectable } from '@nestjs/common';

import { CourseEntity, UserEntity } from 'entities/index.entity';
import {
  TransferCourseSettingDto,
  TransferStudentToCourseDto,
} from 'course/dto';
import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteService } from './course-training-site.service';
import { TrainingSiteTimeSlotService } from 'training-time-slot/training-time-slot.service';
import { PlacementService } from 'placement/placement.service';
import {
  CoursesRepositoryService,
  StudentCourseRepositoryService,
} from 'repository/services';

@Injectable()
export class CourseTransferService {
  constructor(
    private readonly studentCourseRepository: StudentCourseRepositoryService,
    private readonly courseRepository: CoursesRepositoryService,
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
            course: { id: body.courseId },
            student: { id: studentId },
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
      const course = await this.courseRepository.findOne(
        {
          id: sourceCourseId,
        },
        {
          trainingSite: {
            departmentUnit: true,
            timeslots: { placements: { student: true } },
          },
          student: { student: true },
        },
      );

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
              course: { id: destinationCourseId },
              student: { id: student.id },
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
}
