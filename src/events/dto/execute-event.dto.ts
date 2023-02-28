import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ExecuteEventDto {
  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  public audiences: string[];
}
