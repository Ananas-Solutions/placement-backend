import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from 'commons/dto';

export class QueryDepartmentUnitsDto extends SearchQueryDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  departmentIds: string[];
}
