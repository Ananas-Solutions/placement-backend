import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StudentKinDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsEmail()
  public email!: string;
}
