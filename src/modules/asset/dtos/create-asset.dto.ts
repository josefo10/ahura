export class AvailabilityDto {
  accessibility: boolean;
  location: string;
}

export class ClassificationLevelDto {
  level: 'alta' | 'media' | 'baja';
}

export class HowIsItStoredDto {
  pecetKnowledge: string;
  centralicedRepositories: string;
}

export class LegalRegulationsDto {
  copyright: string;
  patents: string;
  tradeSecrests: string;
  industrialDesigns: string;
  brands: string;
  industrialIntellectualProperty: string;
}

export class CreateAssetDto {
  id: string;
  title: string;
  publishDate: Date;
  knowledgeType: 'explícito' | 'tácito';
  description: string;
  image: string;
  activeKnowledgeType: string; // Puedes hacer un enum o union string literal si lo quieres restringir
  format: string; // Igual que arriba
  fileUri: string;
  relatedIds: string[];
  keywords: string[];
  origin: 'investigación' | 'experiencia' | 'desarrollo' | 'otros';
  availability: AvailabilityDto;
  classificationLevel: ClassificationLevelDto;
  howIsItStored: HowIsItStoredDto;
  ownerId: string;
  responsibleOwner: string;
  confidentiality: boolean;
  criticality: 'leve' | 'moderado' | 'grave';
  LegalRegulations: LegalRegulationsDto;
  status: 'en curso' | 'finalizado' | 'suspendido';
  createAt: Date;
  updateAt: Date;
}
