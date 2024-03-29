import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CourseBlockTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public blockId: string;

  @IsNotEmpty()
  @IsString()
  public departmentUnitId: string;
}
