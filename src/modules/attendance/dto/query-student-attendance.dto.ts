import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from 'commons/dto';

export class QueryStudentAttendanceReportDto extends SearchQueryDto {
  @IsNotEmpty()
  @IsString()
  public studentId!: string;

  @IsOptional()
  @IsString()
  public trainingSiteId?: string;

  @IsNotEmpty()
  @IsString()
  startDate!: Date;

  @IsNotEmpty()
  @IsString()
  endDate!: Date;
}
