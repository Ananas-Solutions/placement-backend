import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';

import { ISuccessMessageResponse } from 'commons/response';
import { UserDocumentEntity } from 'entities/user-document.entity';
import { UserEntity } from 'entities/user.entity';
import { UserService } from 'user/user.service';

import { DocumentVerifyDto } from './dto/document-verify.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { IDocumentResponse } from './response/document.response';
import { StudentCourseEntity } from 'entities/student-course.entity';
import { NotificationEntity } from 'entities/notification.entity';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { FileUploadService } from 'helper/file-uploader.service';

import { DefineMasterUserDocumentListDto } from './dto';
import { CourseEntity } from 'entities/courses.entity';

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
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly userService: UserService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async defineUserDocumentMasterList(body: DefineMasterUserDocumentListDto) {
    const { documentLists } = body;

    await Promise.all(
      documentLists.map(async (document) => {
        const { name, implication, courseId } = document;

        const data = {
          name,
          implication,
        };

        if (courseId) {
          data['course'] = { id: courseId } as CourseEntity;
        }

        await this.documentRepository.save(data);
      }),
    );

    return { message: 'Master document list defined successfully' };
  }

  async getMasterList() {
    const allDocument = await this.documentRepository.find({
      where: { implication: 'global' },
    });

    return allDocument;
  }

  async uploadDocuments(userId: string, body: UploadDocumentDto) {
    const user = await this.userService.findUserById(userId);

    await this.documentRepository.save({
      ...body,
      user: { id: userId } as UserEntity,
    });

    const message = `${user.name} has uploaded document for verification.`;
    const contentUrl = body.url;

    // find all coordinators for this student
    const studentAllCourses = await this.studentCourseRepository.find({
      where: { student: { id: userId } },
      relations: ['course', 'course.coordinator'],
    });

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
    const allDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
      },
      loadEagerRelations: false,
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
