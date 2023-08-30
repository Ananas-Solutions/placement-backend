import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ExecuteEventDto {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public date: string;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  public audiences: string[];
}
