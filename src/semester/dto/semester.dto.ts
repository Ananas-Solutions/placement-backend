import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SemesterEnum } from '../type/semester.type';

export class SemesterDto {
  @IsEnum(SemesterEnum)
  semester: SemesterEnum;

  @IsString()
  @IsNotEmpty()
  year: string;
}

export class UpdateSemesterDto extends SemesterDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
