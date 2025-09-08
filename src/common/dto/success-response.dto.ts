import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Datos de la respuesta' })
  data: T[];

  @ApiProperty({ description: 'Total de elementos', example: 100 })
  total: number;

  @ApiProperty({ description: 'Página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de éxito',
    example: 'Operation completed successfully',
  })
  message: string;
}

export class CreatedResponseDto extends SuccessResponseDto {
  @ApiProperty({ description: 'ID del recurso creado', example: 'ASSET-001' })
  id: string;
}

export class UpdatedResponseDto extends SuccessResponseDto {
  @ApiProperty({ description: 'Número de registros afectados', example: 1 })
  affected: number;
}

export class DeletedResponseDto extends SuccessResponseDto {
  @ApiProperty({ description: 'Confirmación de eliminación', example: true })
  deleted: boolean;
}
