import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { UserDocumentEntity } from 'entities/user-document.entity';
import { UserEntity } from 'entities/user.entity';

import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { IDocumentResponse } from './response/document.response';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'user/user.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserDocumentService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(UserDocumentEntity)
    private readonly documentRepository: Repository<UserDocumentEntity>,
    private readonly userService: UserService,
  ) {}

  async uploadDocuments(userId: string, body: UploadDocumentDto) {
    const user = await this.userService.findUserById(userId);

    await this.documentRepository.save({
      ...body,
      user: { id: userId } as UserEntity,
    });

    const message = `${user.name} has uploaded document for verification.`;
    const contentUrl = body.url;

    //emmiting messages now
    this.server.emit('document-message', { message });

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
  ): Promise<ISuccessMessageResponse> {
    await this.documentRepository.update(
      { id: documentId },
      {
        ...body,
      },
    );

    return {
      message: `Document has been ${body.status.toLowerCase()} successfully.`,
    };
  }

  async getUserDocuments(userId: string): Promise<IDocumentResponse[]> {
    const allDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
      },
    });

    return allDocuments.map((document) => this.transformToResponse(document));
  }

  private transformToResponse(document: UserDocumentEntity) {
    const { id, name, url, status, comments, documentExpiryDate } = document;

    return {
      id,
      name,
      url,
      status,
      comments,
      documentExpiryDate,
    };
  }
}
