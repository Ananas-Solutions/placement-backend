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
import {
  CreateTrainingSiteDto,
  UpdateTrainingSiteDto,
} from './dto/training-site.dto';
import { TrainingSiteService } from './training-site.service';

@ApiTags('training site')
@UseInterceptors(ErrorInterceptor)
@Controller('training-site')
export class TrainingSiteController {
  constructor(private readonly service: TrainingSiteService) {}

  @Post()
  async saveTrainingSite(@Body() body: CreateTrainingSiteDto): Promise<any> {
    return await this.service.create(body);
  }

  @Get(':id')
  async getTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.findOne(id);
  }

  @Put()
  async updateTrainingSite(@Body() body: UpdateTrainingSiteDto): Promise<any> {
    const { id, ...rest } = body;
    return await this.service.update(id, rest);
  }

  @Delete(':id')
  async deleteTrainingSite(@Param('id') id: string): Promise<any> {
    return await this.service.delete(id);
  }
}
