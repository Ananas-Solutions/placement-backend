import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StudentPlacementDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: [string];

  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsNotEmpty()
  @IsString()
  timeSlotId: string;
}
