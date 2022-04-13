import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ErrorInterceptor } from 'src/interceptors/error-interceptor';
import { StudentPlacementDto } from './dto/placement.dto';
import { PlacementService } from './placement.service';

@ApiTags('placement')
@Controller('placement')
@UseInterceptors(ErrorInterceptor)
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Post()
  async assignPlacement(@Body() body: StudentPlacementDto): Promise<any> {
    return await this.placementService.assignPlacment(body);
  }

  @Get('student/:studentId')
  async getStudentSites(@Param('studentId') studentId: string): Promise<any> {
    return await this.placementService.findStudentTrainingSite(studentId);
  }

  @Get('training-site/:trainingSiteId')
  async getTrainingSiteStudents(
    @Param('trainingSiteId') trainingSiteId: string,
  ): Promise<any> {
    return await this.placementService.findTrainingSiteStudents(trainingSiteId);
  }
}
