import { RegisterDto } from '@/auth/dto/register.dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  public validate(passwordConfirmation: string, args: ValidationArguments) {
    const dto = args.object as RegisterDto;
    return dto.password === passwordConfirmation;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Passwords mismatch';
  }
}
