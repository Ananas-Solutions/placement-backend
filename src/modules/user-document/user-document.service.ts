import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { ISuccessMessageResponse } from 'commons/response';
import { UserDocumentEntity } from 'entities/user-document.entity';
import { UserEntity } from 'entities/user.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { UserService } from 'user/user.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import {
  NotificationRepositoryService,
  StudentCourseRepositoryService,
  UserDocumentRepositoryService,
} from 'repository/services';

import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { IDocumentResponse } from './response/document.response';

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
    private readonly documentRepository: UserDocumentRepositoryService,
    private readonly studentCourseRepository: StudentCourseRepositoryService,
    private readonly notificationRepository: NotificationRepositoryService,
    private readonly userService: UserService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async uploadDocuments(userId: string, body: UploadDocumentDto) {
    const user = await this.userService.findUserById(userId);

    await this.documentRepository.save({
      ...body,
      user: { id: userId } as UserEntity,
    });

    const message = `${user.name} has uploaded document for verification.`;
    const contentUrl = body.url;

    // find all coordinators for this student
    const studentAllCourses = await this.studentCourseRepository.findMany(
      {
        student: { id: userId },
      },
      { course: { coordinator: true } },
    );

    const studentCoordinatorsId = studentAllCourses.map(
      (s) => s.course.coordinator.id,
    );

    await Promise.all(
      studentCoordinatorsId.map(async (coordinatorId) => {
        this.websocketGateway.emitEvent(`${coordinatorId}/document-message`, {
          message,
        });

        await this.notificationRepository.save({
          message,
          contentUrl,
          user: { id: coordinatorId } as UserEntity,
        });
      }),
    );

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
    const allDocuments = await this.documentRepository.findMany({
      user: { id: userId },
    });

    return await Promise.all(
      allDocuments.map((document) => this.transformToResponse(document)),
    );
  }

  private async transformToResponse(document: UserDocumentEntity) {
    const { id, name, url, status, comments, documentExpiryDate } = document;

    return {
      id,
      name,
      url: await this.fileUploadService.getUploadedFile(url),
      status,
      comments,
      documentExpiryDate,
    };
  }
}
