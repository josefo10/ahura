import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import { ApikeyGuard } from '../auth/guards/apikey.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { Logger } from './schemas/logger.schema';

@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('loggers')
@Controller('loggers')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post()
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Crear un nuevo log de auditoria' })
  @ApiResponse({
    status: 201,
    description: 'Log creado exitosamente',
    type: Logger,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  create(@Body() createDto: CreateLoggerDto) {
    return this.loggerService.create(createDto);
  }

  @Get()
  @Roles('super_administrador')
  @ApiOperation({ summary: 'Obtener todos los logs de auditoría' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs de auditoría',
    type: [Logger],
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  findAll() {
    return this.loggerService.findAll();
  }

  @Get(':id')
  @Roles('super_administrador')
  @ApiOperation({ summary: 'Obtener un log por ID' })
  @ApiParam({ name: 'id', description: 'ID único del log' })
  @ApiResponse({ status: 200, description: 'Log encontrado', type: Logger })
  @ApiNotFoundResponse({ description: 'Log no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  findOne(@Param('id') id: string) {
    return this.loggerService.findOne(id);
  }
  @Patch(':id')
  @Roles('super_administrador')
  @ApiOperation({ summary: 'Actualizar un log por ID' })
  @ApiParam({ name: 'id', description: 'ID único del log' })
  @ApiResponse({
    status: 200,
    description: 'Log actualizado exitosamente',
    type: Logger,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Log no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  update(@Param('id') id: string, @Body() updateDto: UpdateLoggerDto) {
    return this.loggerService.update(id, updateDto);
  }
  @Delete(':id')
  @Roles('super_administrador')
  @ApiOperation({ summary: 'Eliminar un log por ID' })
  @ApiParam({ name: 'id', description: 'ID único del log' })
  @ApiResponse({ status: 200, description: 'Log eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Log no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  remove(@Param('id') id: string) {
    return this.loggerService.remove(id);
  }
}
