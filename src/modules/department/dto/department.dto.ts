import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}
