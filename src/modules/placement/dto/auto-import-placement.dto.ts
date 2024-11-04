import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AutoImportPlacementDateDto {
  @IsNotEmpty()
  @IsString()
  timeslotId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  studentEmails: string[];
}

export class AutoImportPlacementDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  placement: AutoImportPlacementDateDto[];
}
