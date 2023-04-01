import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  supervisor: string;
}
