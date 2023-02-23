import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';

export class StudentPlacementDto {
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
