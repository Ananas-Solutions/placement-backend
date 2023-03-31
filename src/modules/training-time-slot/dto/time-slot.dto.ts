import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class TimeSlotDto {
  day: string[];

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  // @IsNumber()
  capacity: number;

  @IsOptional()
  @IsUUID()
  @IsString()
  supervisor: string;
}
