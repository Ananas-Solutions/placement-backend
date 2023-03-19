import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { TrainingTimeSlot } from 'src/training-time-slot/entity/training-time-slot.entity';
import { TrainingDaysEnum } from 'src/training-time-slot/types/training-site-days.enum';
import { User } from 'src/user/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { StudentPlacementDto } from './dto/placement.dto';
import { Placement } from './entity/placement.entity';
import { StudentAvailabilityInterface } from './interface/student-availability.interface';
import { StudentTrainingSites } from './interface/student-training-sites.interface';
import { TrainingSiteStudents } from './interface/training-site-students.interface';

@Injectable()
export class PlacementService {
  constructor(
    @InjectRepository(Placement)
    private readonly placementRepository: Repository<Placement>,
    @InjectRepository(CourseTrainingSite)
    private readonly courseTrainingSite: Repository<CourseTrainingSite>,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async assignPlacment(bodyDto: StudentPlacementDto): Promise<any> {
    try {
      const { trainingSiteId, timeSlotIds } = bodyDto;
      await Promise.all(
        timeSlotIds.map((timeslotId) => {
          bodyDto.studentIds.map(async (studentId) => {
            return await this.placementRepository.save({
              student: { id: studentId } as User,
              trainingSite: { id: trainingSiteId } as CourseTrainingSite,
              timeSlot: { id: timeslotId } as TrainingTimeSlot,
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
  ): Promise<Placement[]> {
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
    try {
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
    } catch (err) {
      throw err;
    }
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

  async findTimeSlotStudents(timeSlotId: string): Promise<Placement[]> {
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
        courseStudents.map(async (student: User) => {
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
  ): Promise<DeleteResult> {
    try {
      return await this.placementRepository.delete({
        id: placementId,
      });
    } catch (err) {
      throw err;
    }
  }

  private async findStudentPlacement(
    studentId: string,
    trainingSiteId: string,
  ) {
    return await this.placementRepository.find({
      student: { id: studentId },
      trainingSite: { id: trainingSiteId },
    });
  }
}
