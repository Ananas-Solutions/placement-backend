import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsNotEmpty()
  authority: string;
}

export class UpdateHospitalDto extends CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
