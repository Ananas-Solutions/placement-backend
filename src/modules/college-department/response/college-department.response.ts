import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CollegeDepartmentResponse {
  @ApiProperty({
    description: 'The id of the college department',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'The name of the college department',
    example: 'Computer Science and Engineering',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The contact email of the college department',
    example: 'cs@gmail.com',
  })
  @Expose()
  @IsOptional()
  contactEmail?: string;
}
