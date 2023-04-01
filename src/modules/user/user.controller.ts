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

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'commons/decorator/roles.decorator';
import { UserRoleEnum } from 'commons/enums';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@UseInterceptors(ErrorInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserDto) {
    return await this.userService.saveUser(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get()
  async queryAllStudents(@Query('role') role: UserRoleEnum) {
    return await this.userService.findAllSpecificUser(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get('student/:studentId')
  async getStudent(@Param('studentId') studentId: string) {
    return await this.userService.findStudentById(studentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  // @Patch('student')
  // async updateStudent(@Body() body) {
  //   return this.userService.updateUser(body);
  // }
}
