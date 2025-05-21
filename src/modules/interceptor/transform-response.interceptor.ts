import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ApiResponseDto } from 'commons/response/api-success-response';
import { map, Observable } from 'rxjs';

interface ResponseWithMetadata {
  data?: unknown;
  message?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  constructor(private readonly dataType?: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: unknown) => {
        const apiResponse = new ApiResponseDto<T>();
        apiResponse.dataType = this.dataType;

        const responseData =
          typeof response === 'object' &&
          response !== null &&
          'data' in response
            ? response.data
            : response;

        const responseMessage =
          typeof response === 'object' &&
          response !== null &&
          'message' in response
            ? response.message
            : undefined;

        const transformedData = this.dataType
          ? Array.isArray(responseData)
            ? responseData.map((item: Record<string, unknown>) =>
                plainToInstance(this.dataType as ClassConstructor<T>, item, {
                  excludeExtraneousValues: true,
                }),
              )
            : plainToInstance(
                this.dataType,
                responseData as Record<string, unknown>,
                {
                  excludeExtraneousValues: true,
                },
              )
          : responseData;

        Object.assign(apiResponse, {
          data: transformedData,
          message: responseMessage,
        });

        return {
          data: transformedData,
          message: responseMessage,
          metadata: (response as ResponseWithMetadata).metadata,
        };
      }),
    );
  }
}
