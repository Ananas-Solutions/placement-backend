import { Type, ClassConstructor } from 'class-transformer';
import { Expose } from 'class-transformer';

export class ApiResponseDto<T> {
  @Expose()
  message?: string;

  @Expose()
  @Type((options) => {
    return (options?.newObject as ApiResponseDto<T>).dataType || Object;
  })
  data?: T;

  @Expose()
  metadata?: Record<string, any>;

  dataType?: ClassConstructor<any>;
}
