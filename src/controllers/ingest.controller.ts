import { Controller, Post, Body, Query, HttpCode, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { EventMessageDto, IngestQueryDto } from '../dto/ingest.dto';

@Controller('v1')
export class IngestController {
  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        const constraints = error.constraints;
        if (constraints) {
          return Object.values(constraints).join(', ');
        }
        return `Ошибка валидации поля ${error.property}`;
      });

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ошибка валидации входящих данных',
        errors: messages,
        timestamp: new Date().toISOString(),
      };
    }
  }))
  async ingest(
    @Query() query: IngestQueryDto,
    @Body() eventMessage: EventMessageDto,
  ) {
    // Дополнительная проверка, что values не пустой объект
    if (Object.keys(eventMessage.values).length === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ошибка валидации входящих данных',
        errors: ['values не может быть пустым объектом'],
        timestamp: new Date().toISOString(),
      };
    }

    // Здесь будет дальнейшая логика обработки
    return {
      statusCode: HttpStatus.OK,
      message: 'Данные успешно получены',
      data: {
        edge: query.edge,
        timestamp: eventMessage.timestamp,
        valuesCount: Object.keys(eventMessage.values).length,
        tags: Object.keys(eventMessage.values),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
