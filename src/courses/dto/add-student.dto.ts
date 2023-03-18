import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddStudentDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  studentid: string;
}
