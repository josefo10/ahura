import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateLoggerDto {
  @ApiProperty({ description: 'ID único del log', example: 'LOG-001' })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({ description: 'ID del activo asociado', example: 'ASSET-001' })
  @IsNotEmpty()
  @IsString()
  readonly assetId: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la acción',
    example: 'USER-123',
  })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty({
    description: 'Acción realizada',
    example: 'view',
    enum: ['view', 'download', 'create', 'update', 'delete'],
  })
  @IsNotEmpty()
  @IsString()
  readonly action: string;

  @ApiProperty({
    description:
      'Fecha de la acción (se genera automáticamente si no se proporciona)',
    example: '2024-01-15T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly date?: Date;
}
