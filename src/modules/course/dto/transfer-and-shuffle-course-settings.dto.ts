import { IsNotEmpty, IsString } from 'class-validator';

export class TransferAndShuffleCourseSettingDto {
  @IsNotEmpty()
  @IsString()
  sourceCourseId: string;

  @IsNotEmpty()
  @IsString()
  destinationCourseId: string;
}
