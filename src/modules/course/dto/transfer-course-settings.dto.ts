import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TransferCourseSettingDto {
  @IsNotEmpty()
  @IsString()
  sourceCourseId: string;

  @IsNotEmpty()
  @IsString()
  destinationCourseId: string;

  @IsArray()
  @ArrayMinSize(1)
  transferProperties: string[];
}
