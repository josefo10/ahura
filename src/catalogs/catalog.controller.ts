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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('catalogs')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  // CRUD base
  @ApiOperation({ summary: 'Create a new catalog' })
  @ApiResponse({
    status: 201,
    description: 'The catalog has been created.',
    type: CreateCatalogDto,
  })
  @Post()
  create(@Body() dto: CreateCatalogDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({
    status: 200,
    description: 'List of all catalogs',
    type: [CreateCatalogDto],
  })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Get a catalog by slug' })
  @ApiResponse({
    status: 200,
    description: 'The catalog has been found.',
    type: CreateCatalogDto,
  })
  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.service.get(slug);
  }

  @ApiOperation({ summary: 'Update a catalog by slug' })
  @ApiResponse({
    status: 200,
    description: 'The catalog has been updated.',
    type: CreateCatalogDto,
  })
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateCatalogDto) {
    return this.service.update(slug, dto);
  }

  @ApiOperation({ summary: 'Delete a catalog by slug' })
  @ApiResponse({
    status: 200,
    description: 'The catalog has been deleted.',
  })
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.service.remove(slug);
  }

  // Utilidades (opcionales)
  @ApiOperation({ summary: 'Get enum keys by catalog slug' })
  @ApiResponse({
    status: 200,
    description: 'List of enum keys',
    type: [String],
  })
  @Get(':slug/enum-keys')
  getEnumKeys(@Param('slug') slug: string) {
    return this.service.getEnumKeys(slug);
  }

  @ApiOperation({ summary: 'Get enum items by catalog slug' })
  @ApiResponse({
    status: 200,
    description: 'List of enum items',
    type: [EnumItemDto],
  })
  @Get(':slug/enum-items')
  getEnumItems(@Param('slug') slug: string) {
    return this.service.getEnumItems(slug);
  }

  // Mutaciones de listas
  @ApiOperation({ summary: 'Add an enum item by catalog slug' })
  @ApiResponse({
    status: 201,
    description: 'The enum item has been added.',
    type: EnumItemDto,
  })
  @Post(':slug/:listName')
  addEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Body() item: EnumItemDto,
  ) {
    return this.service.addEnumItem(slug, listName, item);
  }

  @ApiOperation({ summary: 'Update an enum item by catalog slug' })
  @ApiResponse({
    status: 200,
    description: 'The enum item has been updated.',
    type: EnumItemDto,
  })
  @Patch(':slug/:listName/:key')
  updateEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Param('key') key: string,
    @Body() patch: Partial<EnumItemDto>,
  ) {
    return this.service.updateEnumItem(slug, listName, key, patch);
  }

  @ApiOperation({ summary: 'Remove an enum item by catalog slug' })
  @ApiResponse({
    status: 200,
    description: 'The enum item has been removed.',
  })
  @Delete(':slug/:listName/:key')
  removeEnumItem(
    @Param('slug') slug: string,
    @Param('listName') listName: CatalogListName,
    @Param('key') key: string,
  ) {
    return this.service.removeEnumItem(slug, listName, key);
  }
}
