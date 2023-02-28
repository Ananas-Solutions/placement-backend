import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public date: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  public audiences: string[];
}
