import { IsNotEmpty, IsString } from 'class-validator';

export class QueryTrainingSiteAttendanceDto {
  @IsNotEmpty()
  @IsString()
  public trainingSiteId!: string;

  @IsNotEmpty()
  @IsString()
  date!: Date;
}
