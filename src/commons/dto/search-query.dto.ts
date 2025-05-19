import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
