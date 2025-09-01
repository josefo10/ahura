import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Catalog, CatalogDocument } from './domain/catalog.schema';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { CatalogListName } from './dto/list-name.type';

type EnumItem = { key: string; descripcion?: string };

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Catalog.name)
    private readonly catalogModel: Model<CatalogDocument>,
  ) {}

  /** CRUD base */

  async create(dto: CreateCatalogDto): Promise<Catalog> {
    const exists = await this.catalogModel.exists({ slug: dto.slug });
    if (exists)
      throw new ConflictException(`Ya existe catálogo con slug '${dto.slug}'`);
    const created = new this.catalogModel({
      ...dto,
      updatedAt: new Date(),
    });
    return created.save();
  }

  async findAll(): Promise<Catalog[]> {
    return this.catalogModel.find().lean();
  }

  async get(slug = 'default'): Promise<Catalog> {
    const doc = await this.catalogModel.findOne({ slug }).lean<Catalog>();
    if (!doc) throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return doc;
  }

  async update(slug: string, dto: UpdateCatalogDto): Promise<Catalog> {
    const update: UpdateQuery<Catalog> = { ...dto, updatedAt: new Date() };
    const doc = await this.catalogModel
      .findOneAndUpdate({ slug }, update, { new: true })
      .lean<Catalog>();
    if (!doc) throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return doc;
  }

  async remove(slug: string): Promise<{ deleted: boolean }> {
    const res = await this.catalogModel.deleteOne({ slug });
    if (res.deletedCount === 0)
      throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return { deleted: true };
  }

  /** Helpers de validación que ya tenías */

  private keys(list?: EnumItem[]): string[] {
    return Array.isArray(list) ? list.map((i) => i.key) : [];
  }

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
      ['knowledgeType', dto.knowledgeType, this.keys(cat.knowledgeTypeEnum)],
      ['origin', dto.origin, this.keys(cat.originEnum)],
      ['status', dto.status, this.keys(cat.assetStatusEnum)],
      ['criticality', dto.criticality, this.keys(cat.criticalityEnum)],
      [
        'classificationLevel.level',
        dto.classificationLevel?.level,
        this.keys(cat.classificationLevelLevelEnum),
      ],
      [
        'activeKnowledgeType',
        dto.activeKnowledgeType,
        this.keys(cat.activeKnowledgeTypeEnum),
      ],
      ['format', dto.format, this.keys(cat.formatEnum)],
    ];

    for (const [field, value, allowed] of checks) {
      if (value !== undefined && !allowed.includes(value)) {
        throw new BadRequestException(
          `Valor '${value}' no permitido para ${field}. Permitidos: ${allowed.join(', ')}`,
        );
      }
    }
  }

  async getEnumKeys(slug = 'default'): Promise<Record<string, string[]>> {
    const cat = await this.get(slug);
    return {
      activeKnowledgeTypeEnum: this.keys(cat.activeKnowledgeTypeEnum),
      formatEnum: this.keys(cat.formatEnum),
      knowledgeTypeEnum: this.keys(cat.knowledgeTypeEnum),
      originEnum: this.keys(cat.originEnum),
      classificationLevelLevelEnum: this.keys(cat.classificationLevelLevelEnum),
      criticalityEnum: this.keys(cat.criticalityEnum),
      assetStatusEnum: this.keys(cat.assetStatusEnum),
      commentStatusEnum: this.keys(cat.commentStatusEnum),
      loggerActionEnum: this.keys(cat.loggerActionEnum),
      repositoryEnum: this.keys(cat.repositoryEnum),
    };
  }

  async getEnumItems(slug = 'default'): Promise<Record<string, EnumItem[]>> {
    const cat = await this.get(slug);
    return {
      activeKnowledgeTypeEnum: cat.activeKnowledgeTypeEnum ?? [],
      formatEnum: cat.formatEnum ?? [],
      knowledgeTypeEnum: cat.knowledgeTypeEnum ?? [],
      originEnum: cat.originEnum ?? [],
      classificationLevelLevelEnum: cat.classificationLevelLevelEnum ?? [],
      criticalityEnum: cat.criticalityEnum ?? [],
      assetStatusEnum: cat.assetStatusEnum ?? [],
      commentStatusEnum: cat.commentStatusEnum ?? [],
      loggerActionEnum: cat.loggerActionEnum ?? [],
      repositoryEnum: cat.repositoryEnum ?? [],
    };
  }

  async assertInEnum(
    listName: CatalogListName,
    value: string,
    slug = 'default',
  ): Promise<void> {
    const cat = await this.get(slug);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const allowed = this.keys((cat as any)[listName] as EnumItem[]);
    if (!allowed.includes(value)) {
      throw new BadRequestException(
        `Valor '${value}' no permitido para ${listName}. Permitidos: ${allowed.join(', ')}`,
      );
    }
  }

  /** Mutaciones de listas (add / update / remove de items) */

  async addEnumItem(
    slug: string,
    listName: CatalogListName,
    item: EnumItem,
  ): Promise<Catalog> {
    if (!item?.key) throw new BadRequestException('item.key es requerido');
    // evita duplicar key
    const exists = await this.catalogModel.exists({
      slug,
      [`${listName}.key`]: item.key,
    });
    if (exists)
      throw new ConflictException(`Ya existe key '${item.key}' en ${listName}`);

    const doc = await this.catalogModel
      .findOneAndUpdate(
        { slug },
        {
          $push: {
            [listName]: { key: item.key, descripcion: item.descripcion ?? '' },
          },
          $set: { updatedAt: new Date() },
        },
        { new: true },
      )
      .lean<Catalog>();

    if (!doc) throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return doc;
  }

  async updateEnumItem(
    slug: string,
    listName: CatalogListName,
    key: string,
    patch: Partial<EnumItem>,
  ): Promise<Catalog> {
    if (!key) throw new BadRequestException('key es requerido');

    const path = `${listName}.$`;
    const doc = await this.catalogModel
      .findOneAndUpdate(
        { slug, [`${listName}.key`]: key },
        {
          $set: {
            ...(patch.key ? { [`${path}.key`]: patch.key } : {}),
            ...(patch.descripcion !== undefined
              ? { [`${path}.descripcion`]: patch.descripcion }
              : {}),
            updatedAt: new Date(),
          },
        },
        { new: true },
      )
      .lean<Catalog>();

    if (!doc)
      throw new NotFoundException(
        `Item con key '${key}' no encontrado en ${listName} del catálogo '${slug}'`,
      );
    return doc;
  }

  async removeEnumItem(
    slug: string,
    listName: CatalogListName,
    key: string,
  ): Promise<Catalog> {
    if (!key) throw new BadRequestException('key es requerido');

    const doc = await this.catalogModel
      .findOneAndUpdate(
        { slug },
        { $pull: { [listName]: { key } }, $set: { updatedAt: new Date() } },
        { new: true },
      )
      .lean<Catalog>();

    if (!doc) throw new NotFoundException(`Catálogo '${slug}' no encontrado`);
    return doc;
  }
}
