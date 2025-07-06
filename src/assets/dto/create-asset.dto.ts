import { Availability } from '../schemas/asset.schema';
import { ClassificationLevel } from '../schemas/asset.schema';
import { HowIsItStored } from '../schemas/asset.schema';
import { LegalRegulations } from '../schemas/asset.schema';

export class CreateAssetDto {
  readonly id: string;
  readonly title: string;
  readonly publishDate: Date;
  readonly knowledgeType: string;
  readonly description?: string;
  readonly image?: string;
  readonly activeKnowledgeType?: string;
  readonly format?: string;
  readonly fileUri?: string;
  readonly relatedIds?: string[];
  readonly keywords?: string[];
  readonly availability: Availability;
  readonly classificationLevel: ClassificationLevel;
  readonly howIsItStored?: HowIsItStored;
  readonly LegalRegulations?: LegalRegulations;
  readonly ownerId: string;
  readonly responsibleOwner?: string;
  readonly confidentiality?: boolean;
  readonly criticality?: string;
  readonly status?: string;
}
