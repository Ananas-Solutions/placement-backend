import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}

export class CreateBulkStudentDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsArray()
  @ArrayMinSize(1)
  students: CreateStudentDto[];
}
