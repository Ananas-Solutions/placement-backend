import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class TransferStudentToCourseDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsArray()
  @ArrayMinSize(1)
  studentIds: string[];
}
