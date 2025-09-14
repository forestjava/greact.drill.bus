import { Controller, Sse, Injectable, Res, Post, Body } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LogEventData, SseMessageEvent } from '../interfaces/log.interface';
import { LogsService } from '../services/logs.service';

@Injectable()
@Controller('log')
export class LogController {
  constructor(private readonly logsService: LogsService) { }

  @Sse()
  events(@Res() response: Response): Observable<SseMessageEvent> {
    const clientId = uuidv4();

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
