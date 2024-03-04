import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class HospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  location: any;

  @IsString()
  @IsOptional()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  authorityId: string;
}
