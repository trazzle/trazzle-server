import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    // text가 정의되지 않았거나, null이거나, 공백 문자열만 있는 경우 false를 반환
    return text != null && text.trim().length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    // 기본 에러 메시지 설정
    return `${args.property} should not be empty or whitespace`;
  }
}

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotBlankConstraint,
    });
  };
}
