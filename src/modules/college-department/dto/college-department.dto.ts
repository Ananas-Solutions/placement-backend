import { IsNotEmpty, IsString } from 'class-validator';

export class CollegeDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contactEmail: string;
}
