import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
import { TrainingDaysEnum } from 'src/training-site-time-slot/types/training-site-days.enum';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
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
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async assignPlacment(bodyDto: StudentPlacementDto): Promise<any> {
    try {
      const { trainingSiteId, timeSlotId } = bodyDto;
      await Promise.all(
        bodyDto.studentIds.map(async (studentId) => {
          return await this.placementRepository.save({
            student: { id: studentId } as User,
            trainingSite: { id: trainingSiteId } as TrainingSite,
            timeSlot: { id: timeSlotId } as TrainingSiteTimeSlot,
          });
        }),
      );
      return { message: 'Student assigned to Training Site' };
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
          'trainingSite.authority',
          'trainingSite.hospital',
          'trainingSite.department',
          'timeSlot',
        ],
      });
      const mappedResult = studentTrainingSites.map((studentPlacement) => {
        const { trainingSite, timeSlot } = studentPlacement;
        return {
          name: trainingSite.name,
          address: trainingSite.address,
          authority: trainingSite.authority.name,
          hospital: trainingSite.hospital.name,
          department: trainingSite.department.name,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          day: timeSlot.day,
        };
      });
      return mappedResult;
    } catch (err) {
      console.log('name err', err);
      throw err;
    }
  }

  async findStudentTrainingSiteForParticularDay(
    studentId: string,
    day: TrainingDaysEnum,
  ): Promise<Placement[]> {
    try {
      return await this.placementRepository.find({
        where: { student: { id: studentId }, timeSlot: { day } },
        relations: ['trainingSite', 'timeSlot'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findTrainingSiteStudents(
    trainingSiteId: string,
  ): Promise<TrainingSiteStudents[]> {
    try {
      const studentsPlacement = await this.placementRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
        relations: ['trainingSite', 'student', 'timeSlot'],
      });
      const mappedTrainingSiteStudents = studentsPlacement.map(
        (studentPlacement) => {
          const { student, timeSlot } = studentPlacement;
          return {
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

  async findTimeSlotStudents(timeSlotId: string): Promise<Placement[]> {
    try {
      return await this.placementRepository.find({
        where: { timeSlot: { id: timeSlotId } },
        relations: ['trainingSite', 'student', 'timeSlot'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findStudentsAvailability(
    courseId: string,
    trainingSiteId: string,
    trainingDay: TrainingDaysEnum,
  ): Promise<StudentAvailabilityInterface> {
    try {
      // finding all students under that particular course
      const courseStudents = await this.studentCourseService.findCourseStudents(
        courseId,
      );

      // now iterating over all students to check whether they are assigned to any trainingSite or not for a given particular day (eg: SUNDAY, MONDAY, etc.)
      const studentTrainingSiteCheck = await Promise.all(
        courseStudents.map(async (student: User) => {
          const studentTrainingSites =
            await this.findStudentTrainingSiteForParticularDay(
              student.id,
              trainingDay,
            );
          //  student has no training site for that particular day
          if (studentTrainingSites.length === 0) {
            return {
              id: student.id,
              email: student.email,
              name: student.name,
              hasPlacementSameDay: false,
            };
          }

          // student has been assigned to some training site for that particular day
          const assignedTrainingSites = studentTrainingSites.map(
            (studentPlacement: Placement) => {
              if (studentPlacement.trainingSite.id === trainingSiteId) {
                return undefined;
              }
              const {
                trainingSite: { name },
                timeSlot: { startTime, endTime },
              } = studentPlacement;
              return {
                trainingSite: name,
                timeSlot: {
                  startTime,
                  endTime,
                },
              };
            },
          );
          const allAssignedTrainingSites =
            assignedTrainingSites.filter(Boolean);

          // if allAssignedTrainingSite is empty it shows that user has trainingSite but not time slots
          // now this contradicts with the functionality of assignedTrainingSites which means that the user is assigned to the training site that is being queryed.
          // so removing those users since they are already inside that trainingSite
          if (allAssignedTrainingSites.length === 0) return undefined;

          return {
            id: student.id,
            email: student.email,
            name: student.name,
            hasPlacementSameDay: true,
            assigendPlacements: allAssignedTrainingSites,
          };
        }),
      );
      const result = [].concat.apply(
        [],
        studentTrainingSiteCheck.filter(Boolean),
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async removeStudentFromTrainingSite(
    studentId: string,
    trainingSiteId: string,
  ): Promise<DeleteResult> {
    try {
      return await this.placementRepository.delete({
        student: { id: studentId },
        trainingSite: { id: trainingSiteId },
      });
    } catch (err) {
      throw err;
    }
  }
}
