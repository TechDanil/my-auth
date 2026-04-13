import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsString({ message: "Email must be a string" })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @IsBoolean({ message: "Is two factor enabled must be a boolean" })
  isTwoFactorEnabled: boolean;
}
