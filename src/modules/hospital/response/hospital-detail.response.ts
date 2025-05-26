import { AuthorityResponse } from 'authority/response';
import { DepartmentResponse } from 'department/response';
import { HospitalResponse } from './hospital.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class HospitalDetailResponse extends HospitalResponse {
  @ApiProperty({
    description: 'The authority of the hospital',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Authority Name',
    },
  })
  @Type(() => AuthorityResponse)
  @Expose()
  authority: AuthorityResponse;

  @ApiProperty({
    description: 'The departments of the hospital',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Department Name',
      },
    ],
  })
  @Expose()
  @Type(() => DepartmentResponse)
  departments: DepartmentResponse[];
}
