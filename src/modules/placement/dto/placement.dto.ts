import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StudentPlacementDto {
  @IsArray()
  @ArrayMinSize(1)
  timeSlotIds: string[];

  @IsNotEmpty()
  @IsString()
  trainingSiteId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: [string];
}
