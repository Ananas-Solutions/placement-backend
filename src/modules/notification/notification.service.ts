import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'entities/notification.entity';
import { Repository } from 'typeorm';
import { INotificationResponse } from './response';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findAllUserNotifications(
    userId: string,
  ): Promise<INotificationResponse[]> {
    const allUserNotifications = await this.notificationRepository.find({
      where: { user: { id: userId } },
    });

    return allUserNotifications.map((notification) =>
      this.transformToNotificationResponse(notification),
    );
  }

  private transformToNotificationResponse(
    entity: NotificationEntity,
  ): INotificationResponse {
    const { id, message, contentUrl, isRead, readAt } = entity;

    return {
      id,
      message,
      contentUrl,
      isRead,
      readAt,
    };
  }
}
