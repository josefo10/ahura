import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'ID único del usuario', example: 'USER-001' })
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@empresa.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty({
    description: 'Rol del usuario',
    example: 'usuario',
    enum: ['usuario', 'administrador', 'super_administrador'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['usuario', 'administrador', 'super_administrador'])
  readonly role: string;
  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+34 600 123 456',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseñaSegura123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
