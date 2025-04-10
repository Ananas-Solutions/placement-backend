import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryStudentAttendanceReportDto {
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
