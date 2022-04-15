import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SelfCreateCourseDto {
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

export class CreateCourseDto extends SelfCreateCourseDto {
  @IsNotEmpty()
  @IsString()
  coordinatorId: string;
}

export class UpdateCourseDto extends SelfCreateCourseDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
