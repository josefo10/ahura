import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { EnumItemDto } from './dto/enum-item.dto';
import { CatalogListName } from './dto/list-name.type';
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

@ApiTags('catalogs')
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @ApiOperation({ summary: 'Crear un nuevo catálogo' })
  @ApiResponse({
    status: 201,
    description: 'Catálogo creado exitosamente',
    type: CreateCatalogDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Post()
  create(@Body() dto: CreateCatalogDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Obtener todos los catálogos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los catálogos',
    type: [CreateCatalogDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obtener un catálogo por slug' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Catálogo encontrado',
    type: CreateCatalogDto,
  })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.service.get(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Actualizar un catálogo por slug' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Catálogo actualizado exitosamente',
    type: CreateCatalogDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  update(@Param('slug') slug: string, @Body() dto: UpdateCatalogDto) {
    return this.service.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Eliminar un catálogo por slug' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Catálogo eliminado exitosamente',
  })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  remove(@Param('slug') slug: string) {
    return this.service.remove(slug);
  }

  @Get(':slug/enum-keys')
  @ApiOperation({ summary: 'Obtener claves enum por slug de catálogo' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de claves enum',
    type: [String],
  })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  getEnumKeys(@Param('slug') slug: string) {
    return this.service.getEnumKeys(slug);
  }

  @Get(':slug/enum-items')
  @ApiOperation({ summary: 'Obtener elementos enum por slug de catálogo' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de elementos enum',
    type: [EnumItemDto],
  })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  getEnumItems(@Param('slug') slug: string) {
    return this.service.getEnumItems(slug);
  }

  @Post(':slug/:listName')
  @ApiOperation({ summary: 'Agregar un elemento enum por slug de catálogo' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiParam({ name: 'listName', description: 'Nombre de la lista enum' })
  @ApiResponse({
    status: 201,
    description: 'Elemento enum agregado exitosamente',
    type: EnumItemDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Catálogo no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  addEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Body() item: EnumItemDto,
  ) {
    return this.service.addEnumItem(slug, listName, item);
  }

  @Patch(':slug/:listName/:key')
  @ApiOperation({ summary: 'Actualizar un elemento enum por slug de catálogo' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiParam({ name: 'listName', description: 'Nombre de la lista enum' })
  @ApiParam({ name: 'key', description: 'Clave del elemento enum' })
  @ApiResponse({
    status: 200,
    description: 'Elemento enum actualizado exitosamente',
    type: EnumItemDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Catálogo o elemento no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  updateEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Param('key') key: string,
    @Body() patch: Partial<EnumItemDto>,
  ) {
    return this.service.updateEnumItem(slug, listName, key, patch);
  }

  @Delete(':slug/:listName/:key')
  @ApiOperation({ summary: 'Eliminar un elemento enum por slug de catálogo' })
  @ApiParam({ name: 'slug', description: 'Identificador único del catálogo' })
  @ApiParam({ name: 'listName', description: 'Nombre de la lista enum' })
  @ApiParam({ name: 'key', description: 'Clave del elemento enum' })
  @ApiResponse({
    status: 200,
    description: 'Elemento enum eliminado exitosamente',
  })
  @ApiNotFoundResponse({ description: 'Catálogo o elemento no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  removeEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Param('key') key: string,
  ) {
    return this.service.removeEnumItem(slug, listName, key);
  }
}
