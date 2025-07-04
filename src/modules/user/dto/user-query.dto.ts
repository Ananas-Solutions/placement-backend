import { IsEnum, IsNotEmpty } from 'class-validator';
import { SearchQueryDto } from 'commons/dto';
import { UserRoleEnum } from 'commons/enums';

export class UserQueryDto extends SearchQueryDto {
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  public role!: UserRoleEnum;
}
