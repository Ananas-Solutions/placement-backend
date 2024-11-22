import { IsNotEmpty, IsString } from 'class-validator';

export class SaveCourseGridViewDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  layout: any;
}
