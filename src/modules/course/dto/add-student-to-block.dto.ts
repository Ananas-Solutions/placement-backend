import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddStudentToBlockDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  blockId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: string[];
}
