import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBlockDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => BlockInfoDto)
  public blocks!: BlockInfoDto[];

  @IsString()
  @IsNotEmpty()
  public courseId!: string;
}

class BlockInfoDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsNumber()
  public capacity!: number;

  @IsString()
  @IsNotEmpty()
  public startsFrom!: string;

  @IsString()
  @IsNotEmpty()
  public endsAt!: string;

  @IsNumber()
  @IsNotEmpty()
  public duration!: number;
}
