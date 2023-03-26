// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Req,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { JwtAuthGuard, RolesGuard } from 'auth/guards';
// import { Roles } from 'commons/decorator';
// import { UserRoleEnum } from 'commons/enums';
// import { ErrorInterceptor } from 'interceptor/error.interceptor';

// import { CoordinatorCollegeDepartmentService } from './coordinator-college-department.service';

// @ApiTags('coordinator college departments')
// @ApiBearerAuth('Admin or Coordinator Token')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(ErrorInterceptor)
// @Controller('coordinator-department')
// export class CoordinatorCollegeDepartmentController {
//   constructor(private readonly service: CoordinatorCollegeDepartmentService) {}

//   @Roles(UserRoleEnum.CLINICAL_COORDINATOR)
//   @Get()
//   async getDepartments(@Req() req): Promise<any> {
//     return await this.service.findDepartments(req.user.id);
//   }

//   // @Roles(UserRoleEnum.ADMIN)
//   // @Post('admin')
//   // async assignDepartments(
//   //   @Body() body: AdminAssignCollegeDepartments,
//   // ): Promise<any> {
//   //   return await this.service.saveDepartments(
//   //     body.coordinator,
//   //     body.departments,
//   //   );
//   // }

//   @Roles(UserRoleEnum.ADMIN)
//   @Get('admin/coordinator/:coordinatorId')
//   async getCoordinatorDepartments(
//     @Param('coordinatorId') coordinatorId: string,
//   ): Promise<any> {
//     return await this.service.findDepartments(coordinatorId);
//   }

//   @Roles(UserRoleEnum.ADMIN)
//   @Get('admin/department/:collegeDepartmentId')
//   async getDepartmentCoordinators(
//     @Param('collegeDepartmentId') collegeDepartmentId: string,
//   ): Promise<any> {
//     return await this.service.findCoordinators(collegeDepartmentId);
//   }
// }
