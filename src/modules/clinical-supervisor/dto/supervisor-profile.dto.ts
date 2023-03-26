import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupervisorProfileDto {
  @IsNotEmpty()
  @IsString()
  qualification: string;

  @IsNotEmpty()
  @IsString()
  speciality: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsNumber()
  noOfYears: number;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  hospital: string;

  @IsNotEmpty()
  @IsString()
  department: string;
}
