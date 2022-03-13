import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { UserDocuments } from './entity/user-documents.entity';
import { UserDocumentsController } from './user-documents.controller';
import { UserDocumentsService } from './user-documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDocuments]),
    CloudinaryModule,
    UserModule,
  ],
  controllers: [UserDocumentsController],
  providers: [UserDocumentsService],
})
export class UserDocumentsModule {}
