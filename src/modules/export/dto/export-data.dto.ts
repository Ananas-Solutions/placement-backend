import { IsOptional } from 'class-validator';

export class ExportDataDto {
  @IsOptional()
  authority: string[];

  @IsOptional()
  hospital: string[];

  @IsOptional()
  department: string[];

  @IsOptional()
  departmentUnit: string[];

  @IsOptional()
  trainingSites: 'all';

  @IsOptional()
  placementStudents: boolean;
}
