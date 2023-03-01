import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class TrainingSiteEvaluationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public trainingSiteId: string;

  @IsNotEmpty()
  public evaluation: any;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;
}
