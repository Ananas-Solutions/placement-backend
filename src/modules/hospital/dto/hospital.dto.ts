import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class HospitalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  location: any;

  @IsString()
  @IsNotEmpty()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  authorityId: string;
}
