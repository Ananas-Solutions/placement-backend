import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ISuccessMessageResponse } from 'commons/response';
import { NotificationEntity } from 'entities/notification.entity';
import { UserEntity } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto';
import { INotificationResponse } from './response';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
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
    const allUserNotifications = await this.notificationRepository.find({
      where: { ...whereClause, user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
    });

    return allUserNotifications.map((notification) =>
      this.transformToNotificationResponse(notification),
    );
  }

  async readNotification(
    notificationId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.notificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });

    return { message: 'Notification marked as read successfully.' };
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<ISuccessMessageResponse> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    await this.notificationRepository.softRemove(notification);

    return { message: 'Notification removed successfully.' };
  }

  private transformToNotificationResponse(
    entity: NotificationEntity,
  ): INotificationResponse {
    const { id, message, contentUrl, isRead, readAt, createdAt } = entity;

    return {
      id,
      message,
      contentUrl,
      isRead,
      readAt,
      createdAt,
    };
  }
}
