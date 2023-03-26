import { ArrayMinSize, IsArray } from 'class-validator';

export class SelfAssignCollegeDepartments {
  @IsArray()
  @ArrayMinSize(1)
  departments: string[];
}
