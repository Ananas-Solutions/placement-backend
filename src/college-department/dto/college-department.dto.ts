import { IsNotEmpty, IsString } from 'class-validator';

export class CollegeDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCollegeDepartmentDto extends CollegeDepartmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
