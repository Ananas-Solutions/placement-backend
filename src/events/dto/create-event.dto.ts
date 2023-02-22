import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public courseId: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public date: string;
}

export class UpdateEventDto extends CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public id: string;
}
