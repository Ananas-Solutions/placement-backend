import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TransferCourseSettingDto {
  @IsNotEmpty()
  @IsString()
  sourceCourseId: string;

  @IsNotEmpty()
  @IsString()
  destinationCourseId: string;

  @IsArray()
  @MinLength(1)
  transferProperties: string[];
}
