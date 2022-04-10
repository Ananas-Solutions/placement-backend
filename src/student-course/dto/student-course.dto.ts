import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AssignStudentsDto {
  @IsNotEmpty()
  @IsString()
  course: string;

  @IsArray()
  @ArrayMinSize(1)
  students: any;
}

export class AssignCoursesDto {
  @IsNotEmpty()
  @IsString()
  student: string;

  @IsArray()
  @ArrayMinSize(1)
  courses: string[];
}
