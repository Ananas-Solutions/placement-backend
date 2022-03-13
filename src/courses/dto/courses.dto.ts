import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'college department Id' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  semesterId: string;
}

export class UpdateCourseDto extends CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
