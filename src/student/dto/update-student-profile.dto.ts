import { IsNotEmpty, IsString } from 'class-validator';
import { StudentProfileDto } from './student-profile.dto';

export class UpdateStudentProfileDto extends StudentProfileDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
