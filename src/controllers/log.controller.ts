import { Controller, Sse, Injectable, Res, Header } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { LogEventData, SseMessageEvent } from '../interfaces/log.interface';
import { LogsService } from '../services/logs.service';

@Injectable()
@Controller('log')
export class LogController {
  constructor(private readonly logsService: LogsService) { }

  @Sse()
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  events(@Res() response: Response): Observable<SseMessageEvent> {
    const clientId = randomUUID();

    response.on('close', () => {
      this.logsService.removeClient(clientId);
    });

    return this.logsService.addClient(clientId);
  }

  /**
   * Отправляет событие всем подключенным клиентам
   */
  emitEvent(eventData: LogEventData): void {
    this.logsService.broadcast(eventData);
  }

}
