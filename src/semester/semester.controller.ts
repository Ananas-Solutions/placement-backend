import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { SemesterDto, UpdateSemesterDto } from './dto/semester.dto';
import { SemesterService } from './semester.service';

@ApiTags('semester')
@UseInterceptors(ErrorInterceptor)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

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
