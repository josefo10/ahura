import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FindAssetsQueryDto } from './dto/find-assets.query.dto';
import { ApikeyGuard } from 'src/auth/guards/apikey.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { Asset } from './schemas/asset.schema';

@ApiTags('assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  @ApiOperation({ summary: 'Crear un nuevo activo de conocimiento' })
  @ApiResponse({
    status: 201,
    description: 'Activo creado exitosamente',
    type: Asset,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  create(@Body() dto: CreateAssetDto) {
    return this.assetService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los activos con filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de activos',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Asset' } },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 5 },
      },
    },
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Búsqueda global en título, descripción y keywords',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filtrar por título',
  })
  @ApiQuery({
    name: 'userName',
    required: false,
    description: 'Filtrar por nombre de usuario',
  })
  @ApiQuery({
    name: 'legalAny',
    required: false,
    description: 'Buscar en todos los campos legales',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 20,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Ordenamiento (ej: -publishDate,title)',
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findAll(@Query() q: FindAssetsQueryDto) {
    return this.assetService.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un activo por ID' })
  @ApiParam({ name: 'id', description: 'ID único del activo' })
  @ApiResponse({ status: 200, description: 'Activo encontrado', type: Asset })
  @ApiNotFoundResponse({ description: 'Activo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  @ApiOperation({ summary: 'Actualizar un activo por ID' })
  @ApiParam({ name: 'id', description: 'ID único del activo' })
  @ApiResponse({
    status: 200,
    description: 'Activo actualizado exitosamente',
    type: Asset,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Activo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  @ApiOperation({ summary: 'Eliminar un activo por ID' })
  @ApiParam({ name: 'id', description: 'ID único del activo' })
  @ApiResponse({ status: 200, description: 'Activo eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Activo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}
