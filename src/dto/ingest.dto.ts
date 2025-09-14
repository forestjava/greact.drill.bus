import { IsNumber, IsObject, IsString, IsNotEmpty, ValidateNested, IsPositive } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class DataMessageDto {
  [tag: string]: number;
}

export class EventMessageDto {
  @IsNumber({}, { message: 'timestamp должен быть числом' })
  @IsPositive({ message: 'timestamp должен быть положительным числом' })
  timestamp: number;

  @IsObject({ message: 'values должен быть объектом' })
  @IsNotEmpty({ message: 'values не может быть пустым' })
  @Transform(({ value }) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('values должен быть объектом');
    }

    // Проверяем, что все значения в объекте являются числами
    for (const [key, val] of Object.entries(value)) {
      if (typeof key !== 'string' || key.trim() === '') {
        throw new Error(`Ключ тега "${key}" должен быть непустой строкой`);
      }
      if (typeof val !== 'number' || isNaN(val)) {
        throw new Error(`Значение для тега "${key}" должно быть числом`);
      }
    }

    return value;
  })
  values: { [tag: string]: number };
}

export class IngestQueryDto {
  @IsString({ message: 'edge должен быть строкой' })
  @IsNotEmpty({ message: 'edge не может быть пустым' })
  edge: string;
}
