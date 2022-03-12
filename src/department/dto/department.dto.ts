import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}

export class UpdateDepartmentDto extends CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
