import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentVerificationEnum } from '../../../commons/enums/document-verification.enum';

export class DocumentVerifyDto {
  @IsNotEmpty()
  @IsEnum(DocumentVerificationEnum)
  status: DocumentVerificationEnum;

  @IsOptional()
  @IsString()
  comments: string;
}
