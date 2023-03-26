import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { TimeSlotDto } from './time-slot.dto';

export class TrainingSiteTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeslots: TimeSlotDto[];
}
