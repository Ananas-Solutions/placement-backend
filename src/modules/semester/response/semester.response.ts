import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { SuccessMessageResponse } from 'commons/response';
import { SimplifiedSemesterResponse } from './simplified-semester.response';

export class SemesterResponse extends SuccessMessageResponse {
  @ApiProperty({
    description: 'The semester data',
  })
  @Type(() => SimplifiedSemesterResponse)
  @Expose()
  semester: SimplifiedSemesterResponse;
}
