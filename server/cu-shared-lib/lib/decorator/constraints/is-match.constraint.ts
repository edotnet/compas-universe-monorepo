import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function IsMatch(property1: string, property2: string): Function {
  @ValidatorConstraint({ name: "isMatch", async: false })
  class IsMatchValidatorImpl implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
      const { object } = args;
      const prop1Value = object[property1];
      const prop2Value = object[property2];

      if (prop1Value === prop2Value) {
        return true;
      }

      return false;
    }

    defaultMessage(args: ValidationArguments): string {
      return `Passwords does not match`;
    }
  }

  return IsMatchValidatorImpl;
}
