import { IsNotEmpty, IsString } from 'class-validator';

export class SupervisorEvaluationDto {
  @IsNotEmpty()
  @IsString()
  public supervisorId: string;

  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public timeslotId: string;
}
