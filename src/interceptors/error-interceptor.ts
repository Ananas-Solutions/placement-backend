import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundError) {
          throw new NotFoundException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }),
    );
  }
}
