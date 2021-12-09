import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorityDto {
  @IsString()
  @IsNotEmpty()
  initials: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateAuthorityDto extends CreateAuthorityDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
