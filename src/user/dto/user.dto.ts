import { IsEmail, IsEnum, IsString, min, MinLength } from 'class-validator';
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
