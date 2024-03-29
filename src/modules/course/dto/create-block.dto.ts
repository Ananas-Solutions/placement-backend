import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBlockDto {
  @IsString()
  @IsNotEmpty()
  public startsFrom!: string;

  @IsString()
  @IsNotEmpty()
  public endsAt!: string;

  @IsString()
  @IsNotEmpty()
  public duration!: number;

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
}
