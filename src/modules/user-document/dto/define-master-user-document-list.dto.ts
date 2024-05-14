import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class DefineUserDocumentRequirementListDto {
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

  @IsNotEmpty()
  @IsBoolean()
  public isMandatory: boolean;

  @IsNotEmpty()
  @IsString()
  public comment: string;

  @IsOptional()
  @IsString()
  public courseId?: string;
}
