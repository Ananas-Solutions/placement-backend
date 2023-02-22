import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
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

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  supervisor: string;
}

export class TrainingSiteTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsArray()
  @ArrayMinSize(1)
  timeslots: TimeSlot[];
}
