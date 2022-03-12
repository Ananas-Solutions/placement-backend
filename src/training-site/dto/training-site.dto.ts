import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  authorityId: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  speciality: string;

  @IsNotEmpty()
  @IsString()
  location: any;
}

export class UpdateTrainingSiteDto extends CreateTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
