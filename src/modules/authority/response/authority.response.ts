import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorityResponse {
  @ApiProperty({
    description: 'The id of the authority',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the authority',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The initials of the authority',
  })
  @Expose()
  initials: string;

  @ApiProperty({
    description: 'The contact email of the authority',
  })
  @Expose()
  contactEmail?: string;
}
