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
import {
  CreateTrainingSiteDto,
  UpdateTrainingSiteDto,
} from './dto/training-site.dto';
import { TrainingSiteService } from './training-site.service';

@ApiTags('training-site')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('training-site')
export class TrainingSiteController {
  constructor(private readonly service: TrainingSiteService) {}

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Post()
  async saveTrainingSite(@Body() body: CreateTrainingSiteDto): Promise<any> {
    return await this.service.create(body);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get()
  async getAllTrainingSite(): Promise<any> {
    return await this.service.findAll();
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get(':id')
  async getTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('course/:courseId')
  async getTrainingSiteByCourse(
    @Param('courseId') courseId: string,
  ): Promise<any> {
    return await this.service.findByCourse(courseId);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Get('hospital/:hospitalId')
  async getTrainingSiteByHospital(
    @Param('hospitalId') hospitalId: string,
  ): Promise<any> {
    return await this.service.findByHospital(hospitalId);
  }

  @Roles(Role.ADMIN, Role.COORDINATOR)
  @Put()
  async updateTrainingSite(
    @Body() bodyDto: UpdateTrainingSiteDto,
  ): Promise<any> {
    const { id, ...rest } = bodyDto;
    return await this.service.update(id, rest);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.delete(id);
  }
}
