import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DepartmentResponse {
  @ApiProperty({
    description: 'The id of the department',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the department',
    example: 'Department Name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The contact email of the department',
    example: 'department@example.com',
  })
  @Expose()
  contactEmail: string;
}
