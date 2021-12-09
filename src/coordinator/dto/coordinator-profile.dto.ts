import { IsNotEmpty, IsString } from 'class-validator';

export class CoordinatorProfileDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
