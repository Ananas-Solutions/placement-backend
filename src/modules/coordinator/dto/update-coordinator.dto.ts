import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCoordinatorDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsOptional()
  @IsString()
  public departmentId!: string;
}
