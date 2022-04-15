import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async queryAllStudents(@Query('role') role: UserRole): Promise<any> {
    return await this.userService.findAllSpecifcUser(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('student/:studentId')
  async getStudent(@Param('studentId') studentId: string): Promise<any> {
    return await this.userService.findUserById(studentId);
  }
}
