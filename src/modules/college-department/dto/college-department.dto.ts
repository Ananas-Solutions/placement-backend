import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CollegeDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  contactEmail: string;
}
