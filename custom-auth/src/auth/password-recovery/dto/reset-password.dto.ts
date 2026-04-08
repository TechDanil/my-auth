import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
