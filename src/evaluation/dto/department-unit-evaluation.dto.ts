import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class DepartmentUnitEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public departmentUnitId: string;

  @IsObject()
  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;
}
