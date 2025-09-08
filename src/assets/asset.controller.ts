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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Asset } from './schemas/asset.schema';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  create(@Body() dto: CreateAssetDto) {
    return this.assetService.create(dto);
  }

  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'List of assets', type: [Asset] })
  @Get()
  findAll(@Query() q: FindAssetsQueryDto) {
    return this.assetService.findAll(q);
  }

  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset found', type: Asset })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ApikeyGuard, JwtAuthGuard, RolesGuard)
  @Roles('administrador', 'super_administrador')
  remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}
