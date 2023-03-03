import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public url: string;

  @IsOptional()
  @IsDate()
  public expiryDate: Date;
}
