import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Email del usuario para restablecer contraseña',
    example: 'usuario@empresa.com',
  })
  @IsEmail()
  email!: string;
}
