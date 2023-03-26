import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingDaysEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { CourseTrainingSiteEntity } from 'entities/course-training-site.entity';
import { PlacementEntity } from 'entities/placement.entity';
import { TrainingTimeSlotEntity } from 'entities/training-time-slot.entity';
import { UserEntity } from 'entities/user.entity';
import * as _ from 'lodash';
import { StudentCourseService } from 'student-course/student-course.service';
import { Repository } from 'typeorm';
import { StudentPlacementDto } from './dto';

import { StudentAvailabilityInterface } from './interface/student-availability.interface';
import { StudentTrainingSites } from './interface/student-training-sites.interface';
import { TrainingSiteStudents } from './interface/training-site-students.interface';

@Injectable()
export class PlacementService {
  constructor(
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
    @InjectRepository(CourseTrainingSiteEntity)
    private readonly courseTrainingSite: Repository<CourseTrainingSiteEntity>,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async assignPlacment(bodyDto: StudentPlacementDto): Promise<any> {
    try {
      const { trainingSiteId, timeSlotIds } = bodyDto;
      await Promise.all(
        timeSlotIds.map((timeslotId) => {
          bodyDto.studentIds.map(async (studentId) => {
            return await this.placementRepository.save({
              student: { id: studentId } as UserEntity,
              trainingSite: { id: trainingSiteId } as CourseTrainingSiteEntity,
              timeSlot: { id: timeslotId } as TrainingTimeSlotEntity,
            });
          });
        }),
      );

      // bodyDto.studentIds.map(async (studentId) => {
      //   return await this.placementRepository.save({
      //     student: { id: studentId } as User,
      //     trainingSite: { id: trainingSiteId } as CourseTrainingSite,
      //     timeSlot: { id: timeSlotId } as TrainingTimeSlot,
      //   });
      // }),

      return { message: 'Student assigned to training placement succesfully.' };
    } catch (err) {
      throw err;
    }
  }

  async findStudentTrainingSite(
    studentId: string,
  ): Promise<StudentTrainingSites[]> {
    try {
      const studentTrainingSites = await this.placementRepository.find({
        where: { student: { id: studentId } },
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
        relations: ['trainingSite', 'trainingSite.departmentUnit', 'timeSlot'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findTrainingSiteStudents(
    trainingSiteId: string,
    timeSlotId: string,
  ): Promise<TrainingSiteStudents[]> {
    const studentsPlacement = await this.placementRepository.find({
      where: {
        trainingSite: { id: trainingSiteId },
        timeSlot: { id: timeSlotId },
      },
      relations: ['student', 'timeSlot'],
    });

    const mappedTrainingSiteStudents = studentsPlacement.map(
      (studentPlacement) => {
        const { id, student, timeSlot } = studentPlacement;
        return {
          placementId: id,
          studentId: student.id,
          name: student.name,
          email: student.email,
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
      const placements = await this.placementRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
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

      const mappedResult = _.groupBy(mappedPlacements, 'day');

      return mappedResult;
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlotStudents(timeSlotId: string): Promise<PlacementEntity[]> {
    try {
      return await this.placementRepository.find({
        where: { timeSlot: { id: timeSlotId } },
        relations: ['trainingSite', 'trainingSite.departmentUnit', 'student'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findStudentsAvailability(
    trainingSiteId: string,
  ): Promise<StudentAvailabilityInterface[]> {
    try {
      //finding which course does the trainingsite id belongs to;
      const courseTrainingSite = await this.courseTrainingSite.findOne({
        where: { id: trainingSiteId },
        relations: ['course'],
      });
      const course = courseTrainingSite.course;

      // finding all students under that particular course
      const courseStudents = await this.studentCourseService.findCourseStudents(
        course.id,
      );

      const allResults = await Promise.all(
        courseStudents.map(async (student: UserEntity) => {
          const studentTrainingSitePlacement = await this.findStudentPlacement(
            student.id,
            trainingSiteId,
          );
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

  private async findStudentPlacement(
    studentId: string,
    trainingSiteId: string,
  ) {
    return await this.placementRepository.find({
      where: {
        student: { id: studentId },
        trainingSite: { id: trainingSiteId },
      },
    });
  }
}
