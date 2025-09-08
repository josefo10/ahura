import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mensaje de bienvenida de la API' })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  getHello(): string {
    return this.appService.getHello();
  }
}
