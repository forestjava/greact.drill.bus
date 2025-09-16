import { IsNumber, IsObject, IsString, IsNotEmpty, IsPositive, IsBoolean, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isNumberOrBoolean', async: false })
export class IsNumberOrBooleanConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'number' || typeof value === 'boolean';
  }

  defaultMessage(args: ValidationArguments) {
    return 'Значение должно быть числом или булевым значением';
  }
}

export class IngestMessageValuesDto {
  [tag: string]: number | boolean;
}

@ValidatorConstraint({ name: 'validateValuesObject', async: false })
export class ValidateValuesObjectConstraint implements ValidatorConstraintInterface {
  validate(values: any, args: ValidationArguments) {
    if (typeof values !== 'object' || values === null || Array.isArray(values)) {
      return false;
    }

    for (const [key, value] of Object.entries(values)) {
      if (typeof value !== 'number' && typeof value !== 'boolean') {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'values должен быть объектом, где каждое значение является числом или булевым значением';
  }
}

export class IngestMessageDto {
  @IsNumber({}, { message: 'timestamp должен быть числом' })
  timestamp: number;

  @Validate(ValidateValuesObjectConstraint)
  values: IngestMessageValuesDto;
}

export class IngestQueryDto {
  @IsString({ message: 'edge должен быть строкой' })
  @IsNotEmpty({ message: 'edge не может быть пустым' })
  edge: string;
}

