import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsString()
  contentUrl!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;
}
