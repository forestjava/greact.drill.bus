import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LogEventData, SseMessageEvent } from '../interfaces/log.interface';

@Injectable()
export class LogsService {
  private clientStreams = new Map<string, Subject<SseMessageEvent>>();

  addClient(clientId: string): Observable<SseMessageEvent> {
    const stream = new Subject<SseMessageEvent>();
    this.clientStreams.set(clientId, stream);
    console.log(`Client connected: ${clientId}. Total clients: ${this.clientStreams.size}`);
    return stream.asObservable();
  }

  removeClient(clientId: string) {
    const stream = this.clientStreams.get(clientId);
    if (stream) {
      stream.complete();
      this.clientStreams.delete(clientId);
      console.log(`Client disconnected: ${clientId}. Total clients: ${this.clientStreams.size}`);
    }
  }

  // Получить количество подключенных клиентов
  getClientCount(): number {
    return this.clientStreams.size;
  }

  // Отправка событий всем подключенным клиентам
  broadcast(eventData: LogEventData) {
    const messageEvent: SseMessageEvent = {
      data: eventData,
    };

    //console.log(`Broadcasting event to ${this.clientStreams.size} clients`);
    this.clientStreams.forEach((stream) => stream.next(messageEvent));
  }

}
