import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class HospitalResponse {
  @ApiProperty({
    description: 'The id of the hospital',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the hospital',
    example: 'Hospital Name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The location of the hospital',
    example: {
      detailedName: 'Hospital Name',
      latLng: {
        lat: 10.7769,
        lng: 106.7099,
      },
    },
  })
  @Expose()
  @Type(() => Object)
  location: {
    detailedName: string;
    latLng: {
      lat: number;
      lng: number;
    };
  };

  @ApiProperty({
    description: 'The contact email of the hospital',
    example: 'hospital@example.com',
  })
  @Expose()
  contactEmail: string;
}
