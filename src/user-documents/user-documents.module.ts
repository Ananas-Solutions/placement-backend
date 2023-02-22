import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from 'src/helpers/file-uploader.service';
import { UserModule } from 'src/user/user.module';
import { UserDocuments } from './entity/user-documents.entity';
import { UserDocumentsController } from './user-documents.controller';
import { UserDocumentsService } from './user-documents.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDocuments]), UserModule],
  controllers: [UserDocumentsController],
  providers: [UserDocumentsService, FileUploadService],
})
export class UserDocumentsModule {}
