import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class StudentPlacementDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  timeSlotIds?: string[];

  @IsOptional()
  @IsString()
  trainingSiteId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  blockTimeSlotIds?: string[];

  @IsOptional()
  @IsString()
  blockTrainingSiteId?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: string[];
}
