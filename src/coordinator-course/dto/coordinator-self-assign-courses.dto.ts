import { ArrayMinSize, IsArray } from 'class-validator';

export class CoordinatorSelfAssignCoursesDto {
  @IsArray()
  @ArrayMinSize(1)
  courses: string[];
}
