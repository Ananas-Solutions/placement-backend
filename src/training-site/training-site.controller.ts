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

  @Post()
  async saveTrainingSite(@Body() body: CreateTrainingSiteDto): Promise<any> {
    return await this.service.create(body);
  }

  @Get()
  async getAllTrainingSite(): Promise<any> {
    return await this.service.findAll();
  }

  @Get(':id')
  async getTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.findOne(id);
  }

  @Get('hospital/:hospitalId')
  async getTrainingSiteByHospital(
    @Param('hospitalId') hospitalId: string,
  ): Promise<any> {
    return await this.service.findByHospital(hospitalId);
  }

  @Put()
  async updateTrainingSite(
    @Body() bodyDto: UpdateTrainingSiteDto,
  ): Promise<any> {
    const { id, ...rest } = bodyDto;
    return await this.service.update(id, rest);
  }

  @Delete(':id')
  async deleteTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.delete(id);
  }
}
