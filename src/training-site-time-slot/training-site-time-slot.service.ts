import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlacementService } from 'src/placement/placement.service';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
import { TrainingSiteService } from 'src/training-site/training-site.service';
import { Repository } from 'typeorm';
import { TrainingSiteTimeSlotDto } from './dto/training-site-time-slot.dto';
import { TrainingSiteTimeSlot } from './entity/training-site-time-slot.entity';
import { TrainingDaysEnum } from './types/training-site-days.enum';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingSiteTimeSlot)
    private readonly timeslotRepository: Repository<TrainingSiteTimeSlot>,
    private readonly trainingSiteService: TrainingSiteService,
    private readonly placementService: PlacementService,
  ) {}

  async save(bodyDto: TrainingSiteTimeSlotDto): Promise<{ message: string }> {
    try {
      const { trainingSiteId, ...body } = bodyDto;
      await Promise.all(
        body.timeslots.map(async (timeslot) => {
          return await this.timeslotRepository.save({
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
            day: timeslot.day,
            capacity: timeslot.capacity,
            trainingSite: { id: trainingSiteId } as TrainingSite,
          });
        }),
      );
      return { message: 'Time slots added successfully' };
    } catch (err) {
      throw err;
    }
  }

  async findTimeSlots(trainingSite: string): Promise<TrainingSiteTimeSlot[]> {
    try {
      const trainingSiteAllTimeSlots = await this.timeslotRepository.find({
        where: { trainingSite: trainingSite },
      });
      const allAvailableTimeSlots = await Promise.all(
        trainingSiteAllTimeSlots.map(async (timeSlot: TrainingSiteTimeSlot) => {
          const assingedStudents =
            await this.placementService.findTimeSlotStudents(timeSlot.id);

          return {
            ...timeSlot,
            capacity: timeSlot.capacity - assingedStudents.length,
          };
        }),
      );
      return allAvailableTimeSlots;
    } catch (err) {
      throw err;
    }
  }

  async findDaysTimeSlots(
    trainingSite: string,
    day: TrainingDaysEnum,
  ): Promise<TrainingSiteTimeSlot[]> {
    try {
      const trainingSiteAllTimeSlots = await this.timeslotRepository.find({
        where: { trainingSite: trainingSite, day: day },
      });
      const allAvailableTimeSlots = await Promise.all(
        trainingSiteAllTimeSlots.map(async (timeSlot: TrainingSiteTimeSlot) => {
          const assingedStudents =
            await this.placementService.findTimeSlotStudents(timeSlot.id);
          return {
            ...timeSlot,
            capacity: timeSlot.capacity - assingedStudents.length,
          };
        }),
      );
      return allAvailableTimeSlots;
    } catch (err) {
      throw err;
    }
  }
}
