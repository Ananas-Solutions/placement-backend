import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CourseTrainingSite } from 'src/courses/entity/course-training-site.entity';

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
