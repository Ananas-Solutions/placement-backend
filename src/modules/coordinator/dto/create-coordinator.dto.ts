import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCoordinatorDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public departmentId!: string;
}
