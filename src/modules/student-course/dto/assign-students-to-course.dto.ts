import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class AssignStudentsToCourseDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsArray()
  @ArrayMinSize(1)
  studentsId: any;

  @IsString()
  @IsOptional()
  blockId?: string;
}
