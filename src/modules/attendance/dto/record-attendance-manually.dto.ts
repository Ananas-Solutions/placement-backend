import { IsNotEmpty, IsString } from 'class-validator';

export class RecordStudentAttendanceManuallyDto {
  @IsNotEmpty()
  @IsString()
  public studentId!: string;

  @IsNotEmpty()
  @IsString()
  public trainingSiteId!: string;
}
