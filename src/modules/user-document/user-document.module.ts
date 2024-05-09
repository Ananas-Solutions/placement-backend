import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentCourseEntity, UserDocumentEntity } from 'entities/index.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { UserModule } from 'user/user.module';
import { WebsocketModule } from 'src/websocket/websocket.module';

import { UserDocumentController } from './user-document.controller';
import { UserDocumentService } from './user-document.service';
import { NotificationEntity } from 'entities/notification.entity';
import { MasterUserDocumentEntity } from 'entities/master-user-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterUserDocumentEntity,
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
