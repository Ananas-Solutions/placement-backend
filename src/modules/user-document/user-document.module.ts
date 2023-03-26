import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDocumentEntity } from 'entities/user-document.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { UserModule } from 'user/user.module';
import { WebsocketModule } from 'src/websocket/websocket.module';

import { UserDocumentController } from './user-document.controller';
import { UserDocumentService } from './user-document.service';
import { NotificationEntity } from 'entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDocumentEntity,
      StudentCourseEntity,
      NotificationEntity,
    ]),
    UserModule,
    WebsocketModule,
  ],
  controllers: [UserDocumentController],
  providers: [UserDocumentService, FileUploadService],
})
export class UserDocumentModule {}
