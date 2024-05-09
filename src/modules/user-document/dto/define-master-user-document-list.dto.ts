import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class DefineMasterUserDocumentListDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => DocumentList)
  documentLists: DocumentList[];
}

class DocumentList {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public implication: 'course' | 'global';

  @IsOptional()
  @IsString()
  public courseId?: string;
}
