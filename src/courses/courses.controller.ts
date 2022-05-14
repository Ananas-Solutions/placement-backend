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
  Header,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  SelfCreateCourseDto,
  UpdateCourseDto,
} from './dto/courses.dto';

@ApiTags('course')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CoursesController {
  constructor(private readonly coursesServices: CoursesService) {}

  @Roles(Role.ADMIN)
  @Post()
  async saveCourse(@Body() body: CreateCourseDto, @Req() req): Promise<any> {
    return await this.coursesServices.createCourse({
      ...body,
    });
  }

  @Roles(Role.COORDINATOR)
  @Post('self')
  async selfSaveCourse(
    @Body() body: SelfCreateCourseDto,
    @Req() req,
  ): Promise<any> {
    const userId = req.user.id;
    return await this.coursesServices.createCourse({
      ...body,
      coordinatorId: userId,
    });
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllCourses(): Promise<any> {
    return await this.coursesServices.allCourses();
  }

  @Roles(Role.COORDINATOR, Role.ADMIN)
  @Get('coordinator')
  async getOwnCourses(@Req() req): Promise<any> {
    return await this.coursesServices.allCoordinatorCourses(req.user.id);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('department/:departmentId')
  async queryAllCourses(
    @Param() { departmentId }: { departmentId: string },
  ): Promise<any> {
    return await this.coursesServices.findAllCourses(departmentId);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get(':id')
  async queryOneCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.findOneCourse(id);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Put()
  async updateCourse(@Body() body: UpdateCourseDto): Promise<any> {
    return await this.coursesServices.updateCourse(body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<any> {
    return await this.coursesServices.deleteCourse(id);
  }
}
