import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { SearchQueryDto } from 'commons/dto';

export class QueryHospitalDepartmentDto extends SearchQueryDto {
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  hospitalIds: string[];
}
