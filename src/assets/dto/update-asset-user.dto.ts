import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateAssetUserDto {
  @ApiProperty({
    description: 'Contador de vistas',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly viewCount?: number;

  @ApiProperty({
    description: 'Contador de descargas',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly downloadCount?: number;

  @ApiProperty({
    description: 'Contador de comentarios',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly commentCount?: number;
}