import { IsEmail, IsEnum, IsString, min, MinLength } from 'class-validator';
import { Student } from 'src/student/dto/bulk-student-upload.dto';
import { UserRole } from '../types/user.role';

export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateBulkStudentDto {
  @IsString()
  students: Student[];
}
