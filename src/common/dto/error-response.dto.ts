import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Código de estado HTTP', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({ description: 'Tipo de error', example: 'Bad Request' })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2024-01-15T10:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta donde ocurrió el error',
    example: '/api/assets',
  })
  path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Detalles específicos de errores de validación',
    example: ['title should not be empty', 'email must be a valid email'],
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[] = [];
}

export class UnauthorizedErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Mensaje de error de autorización',
    example: 'Unauthorized',
  })
  message: string = 'Unauthorized';
}

export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Mensaje de recurso no encontrado',
    example: 'Asset not found',
  })
  message: string = 'Not Found';
}

export class InternalServerErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Mensaje de error interno',
    example: 'Internal server error',
  })
  message: string = 'Internal Server Error';
}
