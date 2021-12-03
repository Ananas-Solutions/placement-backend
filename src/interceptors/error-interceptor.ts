import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { Observable, catchError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((err) => {
        const errMessage = err.response || err.message;
        switch (err.status) {
          case 400:
            throw new NotFoundException(errMessage);
          case 409:
            throw new ConflictException(errMessage);
          case 400:
            throw new BadRequestException(errMessage);
          default:
            throw new InternalServerErrorException(errMessage);
        }
      }),
    );
  }
}
