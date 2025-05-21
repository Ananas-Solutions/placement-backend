import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SemesterEnum } from 'commons/enums';

export class SimplifiedSemesterResponse {
  @ApiProperty({
    description: 'The id of the semester',
    example: '1',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The semester',
    example: SemesterEnum.FALL,
  })
  @Expose()
  semester: SemesterEnum;

  @ApiProperty({
    description: 'The start year of the semester',
    example: '2025-05-01',
  })
  @Expose()
  startYear: string;

  @ApiProperty({
    description: 'The end year of the semester',
    example: '2025-11-31',
  })
  @Expose()
  endYear: string;
}
