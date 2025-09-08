import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PasswordResetService } from './password-reset.service';
import { RequestPasswordResetDto } from './dto/request-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-reset.dto';

@ApiTags('auth')
@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly service: PasswordResetService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de restablecimiento enviada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset email sent' },
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Email inválido o datos faltantes' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  request(@Body() body: RequestPasswordResetDto) {
    return this.service.request(body);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar restablecimiento de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successful' },
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Token inválido o datos faltantes' })
  @ApiNotFoundResponse({ description: 'Token no encontrado o expirado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  confirm(@Body() body: ConfirmPasswordResetDto) {
    return this.service.confirm(body);
  }
}
