import { Injectable } from '@nestjs/common';
import { AssetRepository } from '../../infrastructure/asset.repository';
import { CreateAssetDto } from '../../dtos/create-asset.dto';
import { Asset } from '../../domain/asset.entity';

@Injectable()
export class AssetService {
  constructor(private readonly repo: AssetRepository) {}

  async create(dto: CreateAssetDto): Promise<Asset> {
    // Aquí se transforman y/o asignan los valores uno a uno
    const asset = new Asset();
    // Puedes usar una función generateId() si quieres IDs personalizados
    asset.id = this.generateId();
    asset.title = dto.title;
    asset.publishDate = dto.publishDate ?? new Date();
    asset.knowledgeType = dto.knowledgeType;
    asset.description = dto.description;
    asset.image = dto.image;
    asset.activeKnowledgeType = dto.activeKnowledgeType;
    asset.format = dto.format;
    asset.fileUri = dto.fileUri;
    asset.relatedIds = dto.relatedIds ?? [];
    asset.keywords = dto.keywords ?? [];
    asset.origin = dto.origin ?? 'investigación';
    asset.availability = dto.availability;
    asset.classificationLevel = dto.classificationLevel;
    asset.howIsItStored = dto.howIsItStored;
    asset.ownerId = dto.ownerId;
    asset.responsibleOwner = dto.responsibleOwner;
    asset.confidentiality = dto.confidentiality ?? false;
    asset.criticality = dto.criticality ?? 'leve';
    asset.LegalRegulations = dto.LegalRegulations;
    asset.status = dto.status ?? 'en curso';
    asset.createAt = dto.createAt ?? new Date();
    asset.updateAt = dto.updateAt ?? new Date();

    // Ahora pasas la entidad al repositorio
    return this.repo.create(asset);
  }

  // Función simple para generar un id string (puedes reemplazar por uuid)
  private generateId(): string {
    return Date.now().toString();
  }

  async findOne(id: string): Promise<Asset | null> {
    return await this.repo.findById(id);
  }
}
