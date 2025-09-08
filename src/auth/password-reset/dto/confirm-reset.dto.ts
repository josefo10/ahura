import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPasswordResetDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@empresa.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Código de verificación recibido por email',
    example: '123456',
  })
  @IsString()
  @Length(4, 12)
  code!: string;

  @ApiProperty({
    description: 'Nueva contraseña (mínimo 8 caracteres)',
    example: 'MiNuevaContraseña123!',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
