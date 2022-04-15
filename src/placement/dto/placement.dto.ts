import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StudentPlacementDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsNotEmpty()
  @IsString()
  timeSlotId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: [string];
}
