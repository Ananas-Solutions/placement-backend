import { Injectable } from '@nestjs/common';
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
import {
  CourseTrainingSiteRepositoryService,
  PlacementRepositoryService,
} from 'repository/services';

import { StudentPlacementDto } from './dto';
import {
  IStudentAvailabilityInterface,
  IStudentTrainingSites,
  ITrainingSiteStudents,
} from './interface';

@Injectable()
export class PlacementService {
  constructor(
    private readonly placementRepository: PlacementRepositoryService,
    private readonly courseTrainingSite: CourseTrainingSiteRepositoryService,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async assignPlacment(bodyDto: StudentPlacementDto): Promise<any> {
    try {
      const { trainingSiteId, timeSlotIds } = bodyDto;
      await Promise.all(
        timeSlotIds.map((timeslotId) => {
          bodyDto.studentIds.map(async (studentId) => {
            const existingPlacement = await this.placementRepository.findOne({
              student: { id: studentId },
              trainingSite: { id: trainingSiteId },
              timeSlot: { id: timeslotId },
            });

            if (existingPlacement) {
              return;
            }

            return await this.placementRepository.save({
              student: { id: studentId } as UserEntity,
              trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
              timeSlot: { id: timeslotId } as TrainingTimeSlotEntity,
            });
          });
        }),
      );

      return { message: 'Student assigned to training placement succesfully.' };
    } catch (err) {
      throw err;
    }
  }

  async findStudentTrainingSite(
    studentId: string,
  ): Promise<IStudentTrainingSites[]> {
    try {
      const studentTrainingSites = await this.placementRepository.findMany(
        {
          student: { id: studentId },
        },
        {
          trainingSite: {
            departmentUnit: { department: { hospital: { authority: true } } },
          },
          timeSlot: true,
        },
      );

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
      return await this.placementRepository.findMany(
        {
          student: { id: studentId },
          timeSlot: { day },
        },
        { trainingSite: { departmentUnit: true }, timeSlot: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async findTrainingSiteStudents(
    trainingSiteId: string,
    timeSlotId: string,
  ): Promise<ITrainingSiteStudents[]> {
    const studentsPlacement = await this.placementRepository.findMany(
      {
        trainingSite: { id: trainingSiteId },
        timeSlot: { id: timeSlotId },
      },
      { student: true, timeSlot: true },
    );

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

  async groupTrainingSiteStudentsByDay(trainingSiteId: string): Promise<any> {
    try {
      const placements = await this.placementRepository.findMany(
        {
          trainingSite: { id: trainingSiteId },
        },
        { student: true, timeSlot: true },
      );

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
      return await this.placementRepository.findMany(
        {
          timeSlot: { id: timeSlotId },
        },
        { trainingSite: { departmentUnit: true }, student: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async findStudentsAvailability(
    trainingSiteId: string,
  ): Promise<IStudentAvailabilityInterface[]> {
    try {
      //finding which course does the trainingsite id belongs to;
      const courseTrainingSite = await this.courseTrainingSite.findOne(
        {
          id: trainingSiteId,
        },
        { course: true },
      );
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

  async removeStudentFromTrainingSite(
    placementId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.placementRepository.delete({
      id: placementId,
    });

    return { message: 'Student removed from placement successfully.' };
  }

  private async findStudentPlacement(studentId: string, courseId: string) {
    return await this.placementRepository.findMany({
      student: { id: studentId },
      trainingSite: { course: { id: courseId } },
    });
  }

  private async findStudentPlacementByStudentId(studentId: string) {
    return await this.placementRepository.findMany({
      student: { id: studentId },
    });
  }
}
