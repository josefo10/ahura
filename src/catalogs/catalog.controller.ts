import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogs: CatalogService) {}

  @Get()
  getDefault() {
    return this.catalogs.get('default');
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.catalogs.get(slug);
  }
}
