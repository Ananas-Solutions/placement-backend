import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCoordinatorDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public departmentId!: string;
}
