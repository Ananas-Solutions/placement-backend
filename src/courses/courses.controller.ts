import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

import { RolesGuard } from 'src/auth/roles.guard';
import { CoursesService } from './courses.service';
import { CoursesDto, UpdateCoursesDto } from './dto/courses.dto';
import { Courses } from './entity/courses.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDINATOR)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesServices: CoursesService) {}

  @Post()
  async saveCourse(@Body() body: CoursesDto): Promise<any> {
    return await this.coursesServices.createCourse(body);
  }

  @Get()
  async queryAllCourses(): Promise<any> {
    return await this.coursesServices.findAllCourses();
  }

  @Get(':id')
  async queryOneCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.findOneCourse(id);
  }

  @Put()
  async updateCourse(@Body() body: UpdateCoursesDto): Promise<any> {
    return await this.coursesServices.updateCourse(body);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.deleteCourse(id);
  }
}
