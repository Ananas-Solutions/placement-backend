import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AssignCourseStudentsDto {
  @IsNotEmpty()
  @IsString()
  course: string;

  @IsArray()
  @ArrayMinSize(1)
  students: string[];
}
