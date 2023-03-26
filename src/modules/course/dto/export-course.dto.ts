import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class ExportCourseDataDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public course: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  public trainingSites: string[];
}
