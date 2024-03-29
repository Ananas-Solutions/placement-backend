import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ImportCourseSettingDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  blockId: string;

  @IsArray()
  @ArrayMinSize(1)
  transferProperties: string[];
}
