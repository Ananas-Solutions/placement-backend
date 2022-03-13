import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentVerificationEnum } from '../types/document-verification.type';

export class DocumentVerifyDto {
  @IsNotEmpty()
  @IsEnum(DocumentVerificationEnum)
  status: DocumentVerificationEnum;

  @IsOptional()
  @IsString()
  comments: string;
}
