import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUnits } from 'src/department-units/entity/department-units.entity';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
import { TrainingDaysEnum } from 'src/training-site-time-slot/types/training-site-days.enum';
import { User } from 'src/user/entity/user.entity';
import {
  createQueryBuilder,
  DeleteResult,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
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
            departmentUnit: { id: trainingSiteId } as DepartmentUnits,
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
          'departmentUnit',
          'departmentUnit.department',
          'departmentUnit.department.hospital',
          'departmentUnit.department.hospital.authority',
          'timeSlot',
        ],
      });
      const mappedResult = studentTrainingSites.map((studentPlacement) => {
        const { departmentUnit, timeSlot } = studentPlacement;
        return {
          name: departmentUnit.name,
          address: 'address',
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
    timeSlotId: string,
  ): Promise<TrainingSiteStudents[]> {
    try {
      const studentsPlacement = await this.placementRepository.find({
        where: {
          trainingSite: { id: trainingSiteId },
          timeSlot: { id: timeSlotId },
        },
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

  async groupTrainingSiteStudentsByDay(trainingSiteId: string): Promise<any> {
    try {
      // const placements = await this.placementRepository.find({
      //   where: { trainingSite: { id: trainingSiteId } },
      //   relations: ['student', 'timeSlot'],
      // });

      // const mappedPlacements = placements.map((p) => {
      //   return {
      //     studentId: p.student.id,
      //     name: p.student.name,
      //     timeslotId: p.timeSlot.id,
      //     day: p.timeSlot.day,
      //     startTime: p.timeSlot.startTime,
      //     endTime: p.timeSlot.endTime,
      //   };
      // });

      const mappedPlacements = await getManager().query(
        `
      select  COUNT(tsts.id),tsts.id,tsts."startTime", tsts."endTime", tsts."day"  from placement p inner join training_site ts on p."trainingSiteId"=ts.id inner join training_site_time_slot tsts on p."timeSlotId" = tsts .id where ts.id =$1 group by tsts."id" ;
      `,
        [trainingSiteId],
      );

      return mappedPlacements;
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
              if (studentPlacement.departmentUnit.id === trainingSiteId) {
                return undefined;
              }
              const {
                departmentUnit: { name },
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
        departmentUnit: { id: trainingSiteId },
      });
    } catch (err) {
      throw err;
    }
  }
}
