import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DepartmentUnitsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
