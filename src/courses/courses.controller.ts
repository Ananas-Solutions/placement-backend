import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.COORDINATOR)
@Controller('course')
export class CoursesController {
  constructor(private readonly coursesServices: CoursesService) {}

  @Post()
  async saveCourse(@Body() body: CreateCourseDto): Promise<any> {
    return await this.coursesServices.createCourse(body);
  }

  @Get()
  async getAllCourses(): Promise<any> {
    return await this.coursesServices.allCourses();
  }

  @Get('department/:departmentId')
  async queryAllCourses(
    @Param() { departmentId }: { departmentId: string },
  ): Promise<any> {
    return await this.coursesServices.findAllCourses(departmentId);
  }

  @Get(':id')
  async queryOneCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.findOneCourse(id);
  }

  @Put()
  async updateCourse(@Body() body: UpdateCourseDto): Promise<any> {
    return await this.coursesServices.updateCourse(body);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.deleteCourse(id);
  }
}
