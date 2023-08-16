import validator from 'validator';

export class UserValidator {
  static validate(body, toValidate: string[]) {
    const errors: string[] = [];

    if (toValidate.includes('name') && validator.isEmpty(body.name)) {
      errors.push('Name must be provided');
    }

    if (toValidate.includes('email')) {
      if (validator.isEmpty(body.email)) errors.push('Email must be provided');
      if (!validator.isEmail(body.email)) errors.push('Not a valid email');
    }

    if (toValidate.includes('password') && validator.isEmpty(body.password))
      errors.push('Password must be provided');

    return errors;
  }
}
