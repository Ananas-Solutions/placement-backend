import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TrainingDaysEnum } from '../types/training-site-days.enum';

class TimeSlot {
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}

export class TrainingSiteTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsNotEmpty()
  @IsEnum(TrainingDaysEnum)
  day: TrainingDaysEnum;

  @IsArray()
  @ArrayMinSize(1)
  timeslots: TimeSlot[];
}
