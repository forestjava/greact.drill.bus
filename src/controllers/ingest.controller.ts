import { Controller, Post, Body, Query, HttpCode, HttpStatus, BadRequestException, UseInterceptors } from '@nestjs/common';
import { IngestQueryDto, IngestMessageDto } from '../dto/ingest.dto';
import { LogInterceptor } from '../interceptors/log.interceptor';

@Controller('v1')
@UseInterceptors(LogInterceptor)
export class IngestController {


  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  async ingest(
    @Query() query: IngestQueryDto,
    @Body() message: IngestMessageDto,
  ) {

    // Здесь будет дальнейшая логика обработки
    return 'OK';
  }
}
