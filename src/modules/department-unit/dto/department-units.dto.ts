import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentUnitsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
