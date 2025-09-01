import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(4, 12) // configurable, default 6
  code!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
