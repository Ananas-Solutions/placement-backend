import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class SupervisorEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public supervisorId: string;

  @IsObject()
  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;
}
