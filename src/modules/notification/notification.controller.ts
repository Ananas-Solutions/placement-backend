import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards';
import { NotificationService } from './notification.service';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAllNotification(@Req() req, @Query() query) {
    const userId = req.user.id;
    return this.notificationService.findAllUserNotifications(userId, query);
  }

  @Patch(':id')
  async readNotification(@Param('id') id: string) {
    return this.notificationService.readNotification(id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
