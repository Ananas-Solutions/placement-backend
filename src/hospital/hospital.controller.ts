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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';
import { HospitalService } from './hospital.service';

@ApiTags('hospital')
@UseInterceptors(ErrorInterceptor)
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<any> {
    return await this.hospitalService.saveHospital(body);
  }
  @Get()
  async findAllHospital(): Promise<any> {
    return await this.hospitalService.getAllHospital();
  }

  @ApiOperation({
    summary: 'This route is to be used to find all hospitals for an authority.',
  })
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
