import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCourseEventDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public date: string;

  @IsNotEmpty()
  @IsUUID()
  public courseId: string;
}
