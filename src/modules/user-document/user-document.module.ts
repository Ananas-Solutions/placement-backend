import { Module } from '@nestjs/common';

import { FileUploadService } from 'helper/file-uploader.service';
import { UserModule } from 'user/user.module';
import { WebsocketModule } from 'src/websocket/websocket.module';

import { UserDocumentController } from './user-document.controller';
import { UserDocumentService } from './user-document.service';

@Module({
  imports: [UserModule, WebsocketModule],
  controllers: [UserDocumentController],
  providers: [UserDocumentService, FileUploadService],
})
export class UserDocumentModule {}
