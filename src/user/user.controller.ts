import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@UseInterceptors(ErrorInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserDto): Promise<any> {
    return await this.userService.saveUser(body);
  }

  @Get('students')
  async queryAllStudents(): Promise<any> {
    return await this.userService.findAllStudents();
  }
}
