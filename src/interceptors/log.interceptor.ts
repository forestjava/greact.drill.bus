import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogsService } from '../services/logs.service';
import { LogEventData } from '../interfaces/log.interface';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    const requestData = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    }

    return next.handle().pipe(
      tap((data) => {
        const successEventData: LogEventData = {
          at: new Date().toISOString(),
          status: 'success',
          request: requestData,
          data
        };
        this.logsService.broadcast(successEventData);
      }),
      catchError((error) => {
        const errorEventData: LogEventData = {
          at: new Date().toISOString(),
          status: 'error',
          request: requestData,
          error
        };
        this.logsService.broadcast(errorEventData);
        return throwError(() => error);
      })
    );
  }
}
