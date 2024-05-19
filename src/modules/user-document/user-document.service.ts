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

import { DefineUserDocumentRequirementListDto } from './dto';
import { CourseEntity } from 'entities/courses.entity';
import { MasterUserDocumentEntity } from 'entities/master-user-document.entity';

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
    @InjectRepository(MasterUserDocumentEntity)
    private readonly masterDocumentRepository: Repository<MasterUserDocumentEntity>,
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseRepository: Repository<StudentCourseEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly userService: UserService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async defineUserDocumentRequirement(
    body: DefineUserDocumentRequirementListDto,
  ) {
    const { documentLists } = body;

    await Promise.all(
      documentLists.map(async (document) => {
        const { name, implication, courseId, comment, isMandatory } = document;

        const data = {
          name,
          implication,
          comment,
          isMandatory,
        };

        if (courseId) {
          data['course'] = { id: courseId } as CourseEntity;
        }

        await this.masterDocumentRepository.save(data);
      }),
    );

    return { message: 'Master document list defined successfully' };
  }

  async fetchMasterGlobalDocument() {
    return await this.masterDocumentRepository.find({
      where: { implication: 'global' },
    });
  }

  async fetchMasterCourseDocument(courseId: string) {
    return await this.masterDocumentRepository.find({
      where: { implication: 'course', course: { id: courseId } },
    });
  }

  async getMasterList(userId: string) {
    const allGlobalDocument = await this.masterDocumentRepository.find({
      where: { implication: 'global' },
    });

    const allUploadedUserDocument = await this.documentRepository.find({
      where: {
        implication: 'global',
        user: { id: userId },
      },
    });

    const transformedResponse = await Promise.all(
      allGlobalDocument.map(async (document) => {
        const uploadedDocument = allUploadedUserDocument.find(
          (d) => d.name === document.name,
        );

        if (!uploadedDocument) {
          return {
            ...document,
            isDocumentAlreadyUploaded: false,
          };
        }

        return {
          ...document,
          isDocumentAlreadyUploaded: true,
          uploadedDocumentStatus: uploadedDocument.status,
          uploadedDocumentComments: uploadedDocument.comments,
          uploadedDocumentExpiryDate: uploadedDocument.documentExpiryDate,
          uploadedDocumenturl: !uploadedDocument.url
            ? null
            : await this.fileUploadService.getUploadedFile(
                uploadedDocument.url,
              ),
        };
      }),
    );

    return transformedResponse;
  }

  async getCourseMasterList(userId: string, courseId: string) {
    const allCourseDocument = await this.masterDocumentRepository.find({
      where: { implication: 'course', course: { id: courseId } },
    });

    const allUploadedCourseDocument = await this.documentRepository.find({
      where: {
        implication: 'course',
        user: { id: userId },
        course: { id: courseId },
      },
    });

    const transformedResponse = await Promise.all(
      allCourseDocument.map(async (document) => {
        const uploadedDocument = allUploadedCourseDocument.find(
          (d) => d.name === document.name,
        );

        if (!uploadedDocument) {
          return {
            ...document,
            isDocumentAlreadyUploaded: false,
          };
        }

        return {
          ...document,
          isDocumentAlreadyUploaded: true,
          uploadedDocumentStatus: uploadedDocument.status,
          uploadedDocumentComments: uploadedDocument.comments,
          uploadedDocumentExpiryDate: uploadedDocument.documentExpiryDate,
          uploadedDocumenturl: !uploadedDocument.url
            ? null
            : await this.fileUploadService.getUploadedFile(
                uploadedDocument.url,
              ),
        };
      }),
    );

    return transformedResponse;
  }

  async getCourseDocument(courseId: string) {
    const allCourseDocument = await this.masterDocumentRepository.find({
      where: { implication: 'course', course: { id: courseId } },
    });

    return allCourseDocument;
  }

  async uploadDocuments(userId: string, body: UploadDocumentDto) {
    const user = await this.userService.findUserById(userId);

    const data = {
      ...body,
      user: { id: userId } as UserEntity,
    };

    if (body.courseId) {
      data['course'] = { id: body.courseId } as CourseEntity;
    }

    await this.documentRepository.save(data);

    const message = `${user.name} has uploaded ${body.name} document for verification.`;

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

  async getUserAllDocuments(
    userId: string,
    courseId: string,
  ): Promise<IDocumentResponse[]> {
    const allGlobalDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
        implication: 'global',
      },
      loadEagerRelations: false,
    });

    const allCourseDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
        course: { id: courseId },
        implication: 'course',
      },
      loadEagerRelations: false,
    });

    return await Promise.all(
      [...allGlobalDocuments, ...allCourseDocuments].map((document) =>
        this.transformToResponse(document),
      ),
    );
  }

  async getUserGlobalDocuments(userId: string): Promise<IDocumentResponse[]> {
    const allDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
        implication: 'global',
      },
      loadEagerRelations: false,
    });

    return await Promise.all(
      allDocuments.map((document) => this.transformToResponse(document)),
    );
  }

  async getUserCourseDocuments(
    userId: string,
    courseId: string,
  ): Promise<IDocumentResponse[]> {
    const allDocuments = await this.documentRepository.find({
      where: {
        user: { id: userId },
        course: { id: courseId },
        implication: 'course',
      },
      loadEagerRelations: false,
    });

    return await Promise.all(
      allDocuments.map((document) => this.transformToResponse(document)),
    );
  }

  private async transformToResponse(document: UserDocumentEntity) {
    const { id, name, url, status, comments, documentExpiryDate, implication } =
      document;

    return {
      id,
      name,
      implication,
      url: await this.fileUploadService.getUploadedFile(url),
      status,
      comments,
      documentExpiryDate,
    };
  }
}
