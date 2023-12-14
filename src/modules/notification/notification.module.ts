import { Module } from '@nestjs/common';

import { FileUploadService } from 'helper/file-uploader.service';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, FileUploadService],
})
export class NotificationModule {}
