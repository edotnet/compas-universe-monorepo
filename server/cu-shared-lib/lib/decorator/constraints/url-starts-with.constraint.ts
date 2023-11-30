import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "urlStartsWith", async: false })
export class UrlStartsWith implements ValidatorConstraintInterface {
  validate(urls: string[]): boolean | Promise<boolean> {
    const aws_url = process.env.STORAGE_URL;
    let isStartsWith = true;
    urls.map((url) => {
      if (!url.startsWith(aws_url)) {
        isStartsWith = false;
        return false;
      }
    });
    return isStartsWith ? true : false;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `The ${args.property} file base url is incorrect`;
  }
}
