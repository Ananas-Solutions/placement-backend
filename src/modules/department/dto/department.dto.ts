import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}
