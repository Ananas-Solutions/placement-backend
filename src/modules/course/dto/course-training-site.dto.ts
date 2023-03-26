import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CourseTrainingSiteDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public departmentUnitId: string;
}
