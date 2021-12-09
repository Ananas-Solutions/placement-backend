import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentUnitsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  department: string;
}

export class UpdateDepartmentUnitsDto extends DepartmentUnitsDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
