import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((err) => {
        const errMessage = err.response || err.message;
        console.log(err.status);
        switch (err.status) {
          case 404:
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
