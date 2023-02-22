import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  location: any;

  @IsString()
  @IsNotEmpty()
  authorityId: string;
}

export class UpdateHospitalDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsOptional()
  location: any;

  @IsString()
  @IsNotEmpty()
  authorityId: string;
}
