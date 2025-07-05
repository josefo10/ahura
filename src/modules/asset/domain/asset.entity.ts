export class Availability {
  accessibility: boolean;
  location: string;
}

export class ClassificationLevel {
  level: 'alta' | 'media' | 'baja';
}

export class HowIsItStored {
  pecetKnowledge: string;
  centralicedRepositories: string;
}

export class LegalRegulations {
  copyright: string;
  patents: string;
  tradeSecrests: string;
  industrialDesigns: string;
  brands: string;
  industrialIntellectualProperty: string;
}

export class Asset {
  id: string;
  title: string;
  publishDate: Date;
  knowledgeType: 'explícito' | 'tácito';
  description: string;
  image: string;
  activeKnowledgeType: string; // Puedes poner el enum aquí si quieres restringir
  format: string; // Puedes poner el enum aquí si quieres restringir
  fileUri: string;
  relatedIds: string[];
  keywords: string[];
  origin: 'investigación' | 'experiencia' | 'desarrollo' | 'otros'; // Puedes extender si agregas más
  availability: Availability;
  classificationLevel: ClassificationLevel;
  howIsItStored: HowIsItStored;
  ownerId: string;
  responsibleOwner: string;
  confidentiality: boolean;
  criticality: 'leve' | 'moderado' | 'grave';
  LegalRegulations: LegalRegulations;
  status: 'en curso' | 'finalizado' | 'suspendido';
  createAt: Date;
  updateAt: Date;
}
