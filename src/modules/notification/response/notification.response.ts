export interface INotificationResponse {
  id: string;
  message: string;
  documentUrl: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}
