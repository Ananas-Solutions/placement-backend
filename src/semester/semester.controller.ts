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
import { SemesterDto, UpdateSemesterDto } from './dto/semester.dto';
import { SemesterService } from './semester.service';

@ApiTags('semester')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createSemester(@Body() body: SemesterDto): Promise<any> {
    return await this.semesterService.save(body);
  }

  @Get()
  async getAllSemester(): Promise<any> {
    return await this.semesterService.findAll();
  }

  @Put()
  async updateSemester(@Body() body: UpdateSemesterDto): Promise<any> {
    return await this.semesterService.update(body);
  }

  @Delete(':id')
  async deleteSemester(@Param() { id }: { id: string }): Promise<any> {
    return await this.semesterService.delete(id);
  }
}
