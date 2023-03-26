import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDocumentEntity } from 'entities/user-document.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { UserModule } from 'user/user.module';

import { UserDocumentController } from './user-document.controller';
import { UserDocumentService } from './user-document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDocumentEntity]),
    UserModule,
    WebsocketModule,
  ],
  controllers: [UserDocumentController],
  providers: [UserDocumentService, FileUploadService],
})
export class UserDocumentModule {}
