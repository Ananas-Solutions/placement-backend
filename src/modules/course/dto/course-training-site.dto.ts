import { IsNotEmpty, IsString } from 'class-validator';

export class CourseTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public departmentUnitId: string;
}
