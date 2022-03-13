import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

class TimeSlot {
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}

export class TrainingSiteTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsArray()
  @ArrayMinSize(1)
  timeslots: TimeSlot[];
}
