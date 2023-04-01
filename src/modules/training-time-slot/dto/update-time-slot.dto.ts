import { TimeSlotDto } from './time-slot.dto';

export class UpdateTimeSlotDto extends TimeSlotDto {
  trainingSiteId: string;
}
