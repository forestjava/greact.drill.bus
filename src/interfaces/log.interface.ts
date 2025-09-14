export interface LogEventData {
  at: string;
  status: 'success' | 'error';
  request: unknown;
  data?: unknown;
  error?: unknown;
}

export interface SseMessageEvent {
  data: LogEventData;
}
