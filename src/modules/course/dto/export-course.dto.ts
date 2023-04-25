import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ExportCourseDataDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public course: string;
}
