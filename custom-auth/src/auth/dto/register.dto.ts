import { IsPasswordMatchingConstraint } from '@/libs/common/decorators/is-password-matching-constraint';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString({ message: 'Password confirmation must be a string' })
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @MinLength(6, {
    message: 'Password confirmation  must be at least 6 characters long',
  })
  @Validate(IsPasswo  rdMatchingConstraint, {
    message: 'Passwords mismatch',
  })
  passwordConfirmation: string;
}
