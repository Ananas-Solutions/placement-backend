import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
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

  @IsString()
  @IsOptional()
  blockId?: string;

  @IsArray()
  @ArrayMinSize(1)
  students: CreateStudentDto[];
}
