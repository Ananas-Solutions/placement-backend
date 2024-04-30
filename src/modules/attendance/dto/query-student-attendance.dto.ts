import { IsNotEmpty, IsString } from 'class-validator';

export class QueryStudentAttendanceReportDto {
  @IsNotEmpty()
  @IsString()
  public studentId!: string;

  @IsNotEmpty()
  @IsString()
  public trainingSiteId!: string;

  @IsNotEmpty()
  @IsString()
  startDate!: Date;

  @IsNotEmpty()
  @IsString()
  endDate!: Date;
}
