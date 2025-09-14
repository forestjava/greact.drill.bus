import { Controller, Post, Body, Query, HttpCode, HttpStatus, BadRequestException, UseInterceptors, HttpException } from '@nestjs/common';
import { IngestQueryDto, IngestMessageDto } from '../dto/ingest.dto';
import { LogInterceptor } from '../interceptors/log.interceptor';

interface CloudIngestRecord {
  edge: string;
  timestamp: number;
  tag: string;
  value: number;
}

@Controller('v1')
@UseInterceptors(LogInterceptor)
export class IngestController {

  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  async ingest(
    @Query() query: IngestQueryDto,
    @Body() message: IngestMessageDto,
  ) {
    // Формируем массив записей для отправки в облако
    const records: CloudIngestRecord[] = [];

    for (const [tag, value] of Object.entries(message.values)) {
      records.push({
        edge: query.edge,
        timestamp: message.timestamp,
        tag: tag,
        value: value,
      });
    }

    // Получаем URL облачного сервиса из переменных окружения
    const cloudApiUrl = process.env.CLOUD_API_INGEST_URL!;

    const response = await fetch(cloudApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records),
    });

    if (!response.ok) {
      throw new HttpException(
        response.text(),
        response.status
      );
    }

    return await response.json();
  }
}

