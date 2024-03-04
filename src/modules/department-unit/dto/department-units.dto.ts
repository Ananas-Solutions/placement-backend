import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DepartmentUnitsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
