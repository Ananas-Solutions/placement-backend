import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PlacementStudentNameMapDto {
  @IsNotEmpty()
  sno: number;

  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class AutoImportPlacementDateDto {
  @IsNotEmpty()
  @IsString()
  timeslotId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentIds: string[];
}

export class PlacementStudentDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  placement: AutoImportPlacementDateDto[];
}

export class AutoImportPlacementDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  placement: PlacementStudentDto[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentNameMap: PlacementStudentNameMapDto[];
}
