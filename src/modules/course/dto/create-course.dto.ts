import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  creditHours: number;

  @ApiProperty({ description: 'college department Id' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  semesterId: string;

  // @IsOptional()
  // @IsString()
  // coordinatorId: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  coordinatorIds: string[];
}
