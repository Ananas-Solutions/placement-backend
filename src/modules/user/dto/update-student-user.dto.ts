import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public studentId!: string;
}
