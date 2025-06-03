import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from 'commons/dto';

export class QueryAuthorityHospitalDto extends SearchQueryDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1)
  authorityIds: string[];
}
