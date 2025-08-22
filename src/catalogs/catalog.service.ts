import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Catalog, CatalogDocument } from './domain/catalog.schema';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Catalog.name)
    private readonly catalogModel: Model<CatalogDocument>,
  ) {}

  async get(slug = 'default'): Promise<Catalog> {
    const doc = await this.catalogModel.findOne({ slug }).lean<Catalog>();
    if (!doc) throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return doc;
  }

  /**
   * Valida los campos de enums de un DTO de Asset contra el catálogo.
   */
  async validateAssetEnums(
    dto: {
      knowledgeType?: string;
      origin?: string;
      status?: string;
      criticality?: string;
      classificationLevel?: { level?: string };
      activeKnowledgeType?: string;
      format?: string;
    },
    slug = 'default',
  ): Promise<void> {
    const cat = await this.get(slug);

    const checks: Array<[string, string | undefined, string[]]> = [
      ['knowledgeType', dto.knowledgeType, cat.knowledgeTypeEnum],
      ['origin', dto.origin, cat.originEnum],
      ['status', dto.status, cat.assetStatusEnum],
      ['criticality', dto.criticality, cat.criticalityEnum],
      [
        'classificationLevel.level',
        dto.classificationLevel?.level,
        cat.classificationLevelLevelEnum,
      ],
      [
        'activeKnowledgeType',
        dto.activeKnowledgeType,
        cat.activeKnowledgeTypeEnum,
      ],
      ['format', dto.format, cat.formatEnum],
    ];

    for (const [field, value, allowed] of checks) {
      if (value !== undefined && !allowed.includes(value)) {
        throw new Error(
          `Valor '${value}' no permitido para ${field}. Permitidos: ${allowed.join(', ')}`,
        );
      }
    }
  }
}
