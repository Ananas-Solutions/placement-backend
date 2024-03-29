import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { TimeSlotDto } from './time-slot.dto';

export class BlockTrainingSiteTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  blockTrainingSiteId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeslots: TimeSlotDto[];
}
