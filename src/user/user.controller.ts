import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { UserDto } from './dto/user.dto';
import { UserRole } from './types/user.role';
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

  @Get()
  async queryAllStudents(@Query('role') role: UserRole): Promise<any> {
    return await this.userService.findAllSpecifcUser(role);
  }

  // @UseGuards(LocalAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @Get('student/:studentId')
  async getStudent(@Param('studentId') studentId: string): Promise<any> {
    return await this.userService.findUserById(studentId);
  }
}
