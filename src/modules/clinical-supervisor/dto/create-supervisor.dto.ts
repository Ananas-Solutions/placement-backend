import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSupervisorDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public departmentUnitId: string;
}
