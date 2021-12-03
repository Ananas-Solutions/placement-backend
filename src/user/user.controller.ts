import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/interceptors/error-interceptor';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@UseInterceptors(NotFoundInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserDto): Promise<any> {
    return this.userService.saveUser(body);
  }
}
