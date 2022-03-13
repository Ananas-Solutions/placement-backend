import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingSiteTimeSlot } from 'src/training-site-time-slot/entity/training-site-time-slot.entity';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
import { User } from 'src/user/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { StudentPlacementDto } from './dto/placement.dto';
import { Placement } from './entity/placement.entity';

@Injectable()
export class PlacementService {
  constructor(
    @InjectRepository(Placement)
    private readonly placementRepository: Repository<Placement>,
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

  async findStudentTrainingSite(studentId: string): Promise<Placement[]> {
    try {
      return await this.placementRepository.find({
        where: { student: { id: studentId } },
        relations: ['trainingSite', 'timeSlot'],
      });
    } catch (err) {
      throw err;
    }
  }

  async findTrainingSiteStudents(trainingSiteId: string): Promise<Placement[]> {
    try {
      return await this.placementRepository.find({
        where: { trainingSite: { id: trainingSiteId } },
        relations: ['student', 'timeSlot'],
      });
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
