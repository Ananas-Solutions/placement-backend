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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { CreateHospitalDto, UpdateHospitalDto } from './dto/hospital.dto';
import { HospitalService } from './hospital.service';

@ApiTags('hospital')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
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
