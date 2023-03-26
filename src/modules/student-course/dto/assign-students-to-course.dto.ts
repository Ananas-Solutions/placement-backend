import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class AssignStudentsToCourseDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsArray()
  @ArrayMinSize(1)
  studentsId: any;
}
