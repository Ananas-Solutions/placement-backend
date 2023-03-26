export interface INotificationResponse {
  id: string;
  message: string;
  contentUrl: string;
  isRead: boolean;
  readAt?: Date;
}
