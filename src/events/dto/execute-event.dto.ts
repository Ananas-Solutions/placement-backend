import {
  IsArray,
  IsNotEmpty,
  IsSemVer,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class ExecuteEventDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public eventId: string;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  public usersId: string[];
}
