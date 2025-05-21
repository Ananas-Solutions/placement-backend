import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessMessageResponse {
  @ApiProperty({
    description: 'The message of the response',
    example: 'Success',
  })
  @Expose()
  message: string;
}
