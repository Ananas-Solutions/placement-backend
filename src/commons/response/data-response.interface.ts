export interface DataResponse<T> {
  message?: string;
  data?: T;
  metadata?: Record<string, any>;
}
