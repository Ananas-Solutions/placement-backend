import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UserDocuments } from './entity/user-documents.entity';

@Injectable()
export class UserDocumentsService {
  constructor(
    @InjectRepository(UserDocuments)
    private readonly documentRepository: Repository<UserDocuments>,
  ) {}

  async uploadDocuments(userId: string, body: UploadDocumentDto) {
    await this.documentRepository.save({
      ...body,
      user: { id: userId } as User,
    });

    return { message: 'Documents uploaded successfully' };
  }

  async addCommentsInDocument(
    documentId: string,
    comments: string,
  ): Promise<{ message: string }> {
    try {
      await this.documentRepository.update(
        { id: documentId },
        {
          comments,
        },
      );

      return { message: 'Comment added succesfully' };
    } catch (error) {
      throw error;
    }
  }

  async verifyDocument(
    documentId: string,
    body: DocumentVerifyDto,
  ): Promise<{ message: string }> {
    try {
      await this.documentRepository.update(
        { id: documentId },
        {
          ...body,
        },
      );
      return { message: 'Document verified successfully' };
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
