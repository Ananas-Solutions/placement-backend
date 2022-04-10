import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingSite } from 'src/training-site/entity/training-site.entity';
import { TrainingSiteService } from 'src/training-site/training-site.service';
import { Repository } from 'typeorm';
import { TrainingSiteTimeSlotDto } from './dto/training-site-time-slot.dto';
import { TrainingSiteTimeSlot } from './entity/training-site-time-slot.entity';

@Injectable()
export class TrainingSiteTimeSlotService {
  constructor(
    @InjectRepository(TrainingSiteTimeSlot)
    private readonly timeslotRepository: Repository<TrainingSiteTimeSlot>,
    private readonly trainingSiteService: TrainingSiteService,
  ) {}

  async save(bodyDto: TrainingSiteTimeSlotDto): Promise<{ message: string }> {
    try {
      const { trainingSiteId, day, ...body } = bodyDto;
      await Promise.all(
        body.timeslots.map(async (timeslot) => {
          return await this.timeslotRepository.save({
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
            day,
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
      return await this.timeslotRepository.find({
        where: { trainingSite: trainingSite },
      });
    } catch (err) {
      throw err;
    }
  }
}
