import { SuccessMessageResponse } from 'commons/response';
import { HospitalResponse } from './hospital.response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CreateHospitalResponse extends SuccessMessageResponse {
  @ApiProperty({
    description: 'The hospital',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Hospital Name',
    },
  })
  @Type(() => HospitalResponse)
  @Expose()
  data: HospitalResponse;
}
