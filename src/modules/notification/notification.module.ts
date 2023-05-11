import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from 'entities/index.entity';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { FileUploadService } from 'helper/file-uploader.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [NotificationService, FileUploadService],
})
export class NotificationModule {}
