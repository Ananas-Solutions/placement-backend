import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StudentKinDto } from './student-kin.dto';

export class StudentProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  alternateEmail: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  alternatePhone: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2: string;

  @IsOptional()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  kin: StudentKinDto;
}
