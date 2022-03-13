import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UserDocuments } from './entity/user-documents.entity';

@Injectable()
export class UserDocumentsService {
  constructor(
    @InjectRepository(UserDocuments)
    private readonly documentRepository: Repository<UserDocuments>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadDocuments(userId: string, files: Express.Multer.File[]) {
    await Promise.all(
      files.map(async (file) => {
        const cloudinaryResponse = await this.cloudinary.uploadImage(file);
        return await this.documentRepository.save({
          name: file.fieldname,
          url: cloudinaryResponse.url,
          user: { id: userId } as User,
        });
      }),
    );
    return { message: 'Documents uploaded successfully' };
  }

  async verifyDocument(
    documentId: string,
    body: DocumentVerifyDto,
  ): Promise<UpdateResult> {
    try {
      return await this.documentRepository.update(
        { id: documentId },
        {
          ...body,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async getUserDocuments(userId: string): Promise<UserDocuments[]> {
    try {
      return await this.documentRepository.find({
        user: { id: userId },
      });
    } catch (err) {
      throw err;
    }
  }
}
