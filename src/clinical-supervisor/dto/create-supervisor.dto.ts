import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSupervisorDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public departmentUnitId: string;
}
