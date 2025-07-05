import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  //Param,
  //Put,
  //Delete,
} from '@nestjs/common';
import { AssetService } from '../application/services/asset.service';
import { CreateAssetDto } from '../dtos/create-asset.dto';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('/create')
  create(@Body() dto: CreateAssetDto) {
    return this.assetService.create(dto);
  }
  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return await this.assetService.findOne(id);
  }
  // otros métodos...
}
