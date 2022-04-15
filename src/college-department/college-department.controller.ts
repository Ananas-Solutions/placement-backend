import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CollegeDepartmentService } from './college-department.service';
import {
  CollegeDepartmentDto,
  UpdateCollegeDepartmentDto,
} from './dto/college-department.dto';

@ApiTags('college department')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('college-department')
export class CollegeDepartmentController {
  constructor(
    private readonly collegeDepartmentService: CollegeDepartmentService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async createDepartment(@Body() body: CollegeDepartmentDto): Promise<any> {
    return this.collegeDepartmentService.save(body);
  }

  @Get()
  async findAllDepartment(): Promise<any> {
    return this.collegeDepartmentService.findAll();
  }

  @Get(':id')
  async findOneDepartment(@Param() { id }: { id: string }): Promise<any> {
    return this.collegeDepartmentService.findOne(id);
  }

  @Put()
  async updateDepartment(
    @Body() body: UpdateCollegeDepartmentDto,
  ): Promise<any> {
    return this.collegeDepartmentService.update(body);
  }

  @Delete(':id')
  async deleteDepartment(@Param() { id }: { id: string }): Promise<any> {
    return this.collegeDepartmentService.delete(id);
  }
}
