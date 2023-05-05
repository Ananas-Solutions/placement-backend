import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingSiteEvaluationDto {
  @IsNotEmpty()
  @IsString()
  public trainingSiteId: string;

  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public timeslotId: string;
}
