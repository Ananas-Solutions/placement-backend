import { IsNotEmpty, IsString } from 'class-validator';

export class updateCourseBlockDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;
}
