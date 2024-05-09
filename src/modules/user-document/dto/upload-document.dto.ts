import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public implication: 'global' | 'course';

  @IsOptional()
  @IsString()
  public url: string;

  @IsOptional()
  @IsString()
  public documentExpiryDate: Date;

  @IsOptional()
  @IsString()
  public courseId: string;
}
