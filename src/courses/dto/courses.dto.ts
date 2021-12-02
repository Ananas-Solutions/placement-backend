import { IsNotEmpty, IsString } from 'class-validator';

export class CoursesDto {
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

export class UpdateCoursesDto {

  @IsNotEmpty()
  @IsString()
  id:string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  semester: string;

  @IsNotEmpty()
  @IsString()
  year: string;
}
