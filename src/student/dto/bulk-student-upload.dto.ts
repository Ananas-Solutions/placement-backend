import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class Student {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class CreateBulkStudentDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsArray()
  @ArrayMinSize(1)
  students: Student[];
}
