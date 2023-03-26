import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AssignCoursesToStudentDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsArray()
  @ArrayMinSize(1)
  coursesId: string[];
}
