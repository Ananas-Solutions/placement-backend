import { Injectable } from '@nestjs/common';

import { ISuccessMessageResponse } from 'commons/response';
import { NotificationEntity, UserEntity } from 'entities/index.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { NotificationRepositoryService } from 'repository/services';

import { CreateNotificationDto } from './dto';
import { INotificationResponse } from './response';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepositoryService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async saveNotification(
    body: CreateNotificationDto,
  ): Promise<ISuccessMessageResponse> {
    const { message, contentUrl, userId } = body;
    await this.notificationRepository.save({
      message,
      contentUrl,
      user: { id: userId } as UserEntity,
    });

    return { message: 'Notification saved successfully.' };
  }

  async findAllUserNotifications(
    userId: string,
    query,
  ): Promise<INotificationResponse[]> {
    console.log('query', query);
    let whereClause = {};

    if (query.status === 'read') {
      whereClause = { ...whereClause, isRead: true };
    }

    if (query.status === 'unread') {
      whereClause = { ...whereClause, isRead: false };
    }
    const allUserNotifications = await this.notificationRepository.findMany(
      {
        ...whereClause,
        user: { id: userId },
      },
      {},
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );

    return await Promise.all(
      allUserNotifications.map((notification) =>
        this.transformToNotificationResponse(notification),
      ),
    );
  }

  async readNotification(
    notificationId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.notificationRepository.update(
      { id: notificationId },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    return { message: 'Notification marked as read successfully.' };
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.notificationRepository.delete({
      id: notificationId,
    });

    return { message: 'Notification removed successfully.' };
  }

  private async transformToNotificationResponse(
    entity: NotificationEntity,
  ): Promise<INotificationResponse> {
    const { id, message, contentUrl, isRead, readAt, createdAt } = entity;

    return {
      id,
      message,
      documentUrl: await this.fileUploadService.getUploadedFile(contentUrl),
      isRead,
      readAt,
      createdAt,
    };
  }
}
