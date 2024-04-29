import { IsNotEmpty, IsString } from 'class-validator';

export class DefineCourseBlockDto {
  @IsNotEmpty()
  @IsString()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public blockType: 'static' | 'rotating';
}
