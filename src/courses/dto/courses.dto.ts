import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  semester: string;

  @IsNotEmpty()
  @IsString()
  year: string;
}

export class UpdateCourseDto extends CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
