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
  authorityId: string;
}
