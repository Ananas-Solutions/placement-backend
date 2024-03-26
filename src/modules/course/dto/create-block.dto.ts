import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public startsFrom!: string;

  @IsString()
  @IsNotEmpty()
  public endsAt!: string;

  @IsString()
  @IsNotEmpty()
  public courseId!: string;
}
