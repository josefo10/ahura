import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiAuthHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'JWT Bearer token para autenticación',
      required: true,
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    ApiHeader({
      name: 'x-api-key',
      description: 'API Key para acceso a los servicios',
      required: true,
      example: 'your-api-key-here',
    })
  );
}

export function ApiContentTypeHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'Content-Type',
      description: 'Tipo de contenido del request',
      required: true,
      example: 'application/json',
    })
  );
}

export function ApiAllHeaders() {
  return applyDecorators(
    ApiAuthHeaders(),
    ApiContentTypeHeaders()
  );
}