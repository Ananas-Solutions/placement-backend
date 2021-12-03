import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AssignCoordinatorsToCourseDto {
  @IsNotEmpty()
  @IsString()
  course: string;

  @IsArray()
  @ArrayMinSize(1)
  coordinators: string[];
}

export class AssignCoursesToCoordinator {
  @IsNotEmpty()
  @IsString()
  coordinator: string;

  @IsArray()
  @ArrayMinSize(1)
  courses: string[];
}
