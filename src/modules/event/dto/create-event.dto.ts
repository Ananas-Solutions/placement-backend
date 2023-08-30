import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public date?: string;

  @IsOptional()
  @IsArray()
  public authorityIds?: string[];

  @IsOptional()
  @IsArray()
  public hospitalIds?: string[];

  @IsOptional()
  @IsArray()
  public departmentIds?: string[];

  @IsOptional()
  @IsArray()
  public departmentUnitIds?: string[];

  @IsOptional()
  @IsArray()
  public collegeDepartmentIds?: string[];

  @IsOptional()
  @IsArray()
  public coordinatorIds?: string[];

  @IsOptional()
  @IsArray()
  public clinicalSupervisorIds?: string[];
}
