import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class EnumItemDto {
  @ApiProperty({ description: 'Clave única del elemento', example: 'pdf' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Descripción del elemento',
    example: 'Formato de documento PDF',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Indica si el elemento está activo',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
