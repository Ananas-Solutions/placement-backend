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

import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'commons/decorator';
import { UserRoleEnum } from 'commons/enums';
import {
  AddStudentToBlockDto,
  CourseBlockTrainingSiteDto,
  CreateBlockDto,
  ImportCourseSettingDto,
  UpdateCourseBlockDto,
} from 'course/dto';
import { CourseExportService } from 'course/services/course-export.service';
import { CourseTrainingSiteService } from 'course/services/course-training-site.service';
import { CourseTransferService } from 'course/services/course-transfer.service';
import { CourseService } from 'course/services/course.service';
import { ErrorInterceptor } from 'interceptor/error.interceptor';

@ApiTags('course block')
@UseInterceptors(ErrorInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course/block')
export class CourseBlockController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseTrainingSiteService: CourseTrainingSiteService,
    private readonly courseTransferService: CourseTransferService,
    private readonly courseExportService: CourseExportService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addBlocks(@Body() body: CreateBlockDto[]) {
    return this.courseService.addBlocks(body);
  }

  @Post('training-site')
  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  async addBlockTrainingSite(@Body() body: CourseBlockTrainingSiteDto) {
    return this.courseTrainingSiteService.addBlockTrainingSite(body);
  }

  @Post('add-student')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async addStudentToBlock(@Body() body: AddStudentToBlockDto) {
    return this.courseService.addStudentToBlock(body);
  }

  @Post('import-settings')
  @Roles(UserRoleEnum.ADMIN)
  async importCourseSettings(@Body() body: ImportCourseSettingDto) {
    return this.courseTransferService.importCourseSetting(body);
  }

  @Get('training-site/:blockTrainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryBlockTrainingSite(
    @Param('blockTrainingSiteId') blockTrainingSiteId: string,
  ) {
    return await this.courseTrainingSiteService.getBlockTrainingSite(
      blockTrainingSiteId,
    );
  }

  @Get(':blockId/training-sites')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async queryAllBlockTrainingSites(@Param('blockId') blockId: string) {
    return await this.courseTrainingSiteService.getAllBlockTrainingSite(
      blockId,
    );
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  @Get(':id')
  async queryOneBlock(@Param('id') id: string) {
    return await this.courseService.findOneCourseBlock(id);
  }

  @Put('training-site/:trainingSiteId')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.CLINICAL_COORDINATOR)
  async updateBlockTrainingSite(
    @Param('trainingSiteId') trainingSiteId: string,
    @Body() body: CourseBlockTrainingSiteDto,
  ) {
    return await this.courseTrainingSiteService.updateBlockTrainingSite(
      trainingSiteId,
      body,
    );
  }

  @Put(':blockId')
  @Roles(UserRoleEnum.ADMIN)
  async updateBlock(
    @Param('blockId') blockId: string,
    @Body() body: UpdateCourseBlockDto,
  ) {
    return await this.courseService.updateBlock(blockId, body);
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Delete('training-site/:trainingSiteId')
  async deleteBlockTrainingSite(
    @Param('trainingSiteId') trainingSiteId: string,
  ) {
    return await this.courseTrainingSiteService.deleteBlockTrainingSite(
      trainingSiteId,
    );
  }

  @Roles(UserRoleEnum.CLINICAL_COORDINATOR, UserRoleEnum.ADMIN)
  @Delete(':id')
  async deleteBlock(@Param('id') id: string) {
    return await this.courseService.deleteBlock(id);
  }
}
