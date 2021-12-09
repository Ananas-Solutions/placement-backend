import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StudentProfileDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
