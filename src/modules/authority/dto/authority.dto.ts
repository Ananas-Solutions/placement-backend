import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorityDto {
  @IsString()
  @IsNotEmpty()
  initials: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
