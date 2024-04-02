import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCourseBlockDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsNotEmpty()
  @IsNumber()
  public capacity!: number;
}
