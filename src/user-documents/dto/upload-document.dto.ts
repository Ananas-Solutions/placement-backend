import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsDate()
  public date: Date;
}
