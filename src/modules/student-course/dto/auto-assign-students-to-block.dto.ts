import { IsNotEmpty, IsString } from 'class-validator';

export class AutoAssignStudentsToBlockDto {
  @IsNotEmpty()
  @IsString()
  public courseId!: string;
}
