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
  @IsEnum(TrainingDaysEnum)
  day: TrainingDaysEnum;

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
  course: string;

  @IsArray()
  @ArrayMinSize(1)
  timeslots: TimeSlot[];
}
