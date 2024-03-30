import { IsNotEmpty, IsString } from 'class-validator';

export class CourseBlockTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public blockId: string;

  @IsNotEmpty()
  @IsString()
  public departmentUnitId: string;
}
