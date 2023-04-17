import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TransferStudentToCourseDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsArray()
  @MinLength(1)
  studentIds: string[];
}
