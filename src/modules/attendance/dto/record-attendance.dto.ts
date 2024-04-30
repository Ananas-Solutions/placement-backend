import { IsNotEmpty, IsString } from 'class-validator';

export class RecordStudentAttendanceDto {
  @IsNotEmpty()
  @IsString()
  public studentId!: string;

  @IsNotEmpty()
  @IsString()
  public date!: string;

  @IsNotEmpty()
  @IsString()
  public trainingSiteId!: string;
}
