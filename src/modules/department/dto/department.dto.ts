import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}
