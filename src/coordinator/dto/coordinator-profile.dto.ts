import { IsNotEmpty, IsString } from 'class-validator';

export class CoordinatorProfileDto {
  @IsNotEmpty()
  @IsString()
  college: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
