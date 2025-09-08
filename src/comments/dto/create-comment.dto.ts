import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID único del comentario',
    example: 'COMMENT-001',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({ description: 'ID del activo asociado', example: 'ASSET-001' })
  @IsNotEmpty()
  @IsString()
  readonly assetId: string;

  @ApiProperty({
    description: 'ID del autor del comentario',
    example: 'USER-123',
  })
  @IsNotEmpty()
  @IsString()
  readonly authorId: string;

  @ApiProperty({
    description: 'Texto del comentario',
    example: 'Este documento es muy útil para entender la API',
  })
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @ApiProperty({ description: 'Estado del comentario', example: 'activo' })
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @ApiProperty({
    description: 'Nombre del usuario autor',
    example: 'Juan Pérez',
  })
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @ApiProperty({
    description: 'Fecha de creación del comentario (se genera automáticamente)',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly createdAt?: Date;
}
