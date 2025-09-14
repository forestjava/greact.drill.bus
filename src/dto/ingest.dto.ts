import { IsNumber, IsObject, IsString, IsNotEmpty, IsPositive, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export class IngestMessageValuesDto {
  [tag: string]: number;
}

export class IngestMessageDto {
  @IsNumber({}, { message: 'timestamp должен быть числом' })
  timestamp: number;

  @IsObject({ message: 'values должен быть объектом (набор ключ-значение)' })
  values: IngestMessageValuesDto;
}

export class IngestQueryDto {
  @IsString({ message: 'edge должен быть строкой' })
  @IsNotEmpty({ message: 'edge не может быть пустым' })
  edge: string;
}

