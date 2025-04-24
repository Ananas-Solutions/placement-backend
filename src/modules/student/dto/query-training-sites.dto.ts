import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TrainingSiteQueryDateType } from 'commons/enums';

export class QueryTrainingSitesDto {
  @IsEnum(TrainingSiteQueryDateType)
  @IsNotEmpty()
  dateType: TrainingSiteQueryDateType;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
