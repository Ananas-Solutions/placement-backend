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
import { NotFoundInterceptor } from 'src/interceptors/error-interceptor';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';
import { HospitalService } from './hospital.service';

@ApiTags('hospital')
@UseInterceptors(NotFoundInterceptor)
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<any> {
    return await this.hospitalService.saveHospital(body);
  }

  @Get('authority/:authorityId')
  async queryAllHospital(
    @Param() { authorityId }: { authorityId: string },
  ): Promise<any> {
    return await this.hospitalService.findAllHospital(authorityId);
  }

  @Get(':id')
  async queryOneHospital(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.findOneHospital(id);
  }

  @Put()
  async updateHospital(@Body() body: UpdateHospitalDto): Promise<any> {
    return await this.hospitalService.updateOneHospital(body);
  }

  @Delete(':id')
  async deleteHospital(@Param() { id }: { id: string }): Promise<any> {
    return await this.hospitalService.deleteOneHospital(id);
  }
}
