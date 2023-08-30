import { IsOptional } from 'class-validator';

export class ExportDataDto {
  @IsOptional()
  authority: string | string[];

  @IsOptional()
  hospital: string | string[];

  @IsOptional()
  department: string | string[];

  @IsOptional()
  departmentUnit: string | string[];

  @IsOptional()
  placementStudents: string | string[];
}
