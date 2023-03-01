import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class SupervisorEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public supervisorId: string;

  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;
}
