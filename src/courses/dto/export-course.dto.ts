import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class ExportCourseDataDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  public trainingSites: string[];
}
