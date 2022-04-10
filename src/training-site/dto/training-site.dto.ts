import { IsDateString, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateTrainingSiteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

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
  @IsObject()
  location: any;

  @IsNotEmpty()
  @IsString()
  courseId: string;

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
