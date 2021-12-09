import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SelfAssignCollegeDepartments {
  @IsArray()
  @ArrayMinSize(1)
  departments: string[];
}

export class AdminAssignCollegeDepartments extends SelfAssignCollegeDepartments {
  @IsString()
  @IsNotEmpty()
  coordinator: string;
}
