import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function AtLeastOne(property1: string, property2: string): Function {
  @ValidatorConstraint({ name: 'atLeastOne', async: false })
  class AtLeastOneValidatorImpl implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
      const { object } = args;
      const prop1Value = object[property1];
      const prop2Value = object[property2];

      if ((!prop1Value && !prop2Value) || (prop1Value && prop2Value)) {
        return false;
      }

      return true;
    }

    defaultMessage(args: ValidationArguments): string {
      return `Either ${property1} or ${property2} must be provided, but not both.`;
    }
  }

  return AtLeastOneValidatorImpl;
}