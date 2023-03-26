import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SemesterEnum } from '../../../commons/enums/semester.enum';

export class SemesterDto {
  @IsEnum(SemesterEnum)
  semester: SemesterEnum;

  @IsString()
  @IsNotEmpty()
  startYear: string;

  @IsString()
  @IsNotEmpty()
  endYear: string;
}
