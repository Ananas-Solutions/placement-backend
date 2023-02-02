import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTrainingSiteDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  unitId: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  speciality: string;

  @IsOptional()
  @IsObject()
  location: any;

  @IsNotEmpty()
  @IsString()
  startsFrom: string;

  @IsNotEmpty()
  @IsString()
  endsAt: string;
}

export class UpdateTrainingSiteDto extends CreateTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
