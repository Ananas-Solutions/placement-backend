import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class StudentEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public studentId: string;

  @IsObject()
  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;
}
