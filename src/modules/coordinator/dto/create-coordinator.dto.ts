import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoordinatorDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  public departmentId!: string;
}
