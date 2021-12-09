import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  collegeDepartment: string;

  @IsNotEmpty()
  @IsString()
  semester: string;
}

export class UpdateCourseDto extends CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
