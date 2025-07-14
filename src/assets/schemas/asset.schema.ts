import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Sub-schemas
@Schema()
export class Availability {
  @Prop({ required: true })
  accessibility: boolean;

  @Prop({ required: true })
  location: string;
}
export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

@Schema()
export class ClassificationLevel {
  @Prop({ required: true })
  level: string;
}
export const ClassificationLevelSchema =
  SchemaFactory.createForClass(ClassificationLevel);

@Schema()
export class HowIsItStored {
  @Prop() pecetKnowledge: string;
  @Prop() centralicedRepositories: string;
}
export const HowIsItStoredSchema = SchemaFactory.createForClass(HowIsItStored);

@Schema()
export class LegalRegulations {
  @Prop() copyright: string;
  @Prop() patents: string;
  @Prop() tradeSecrests: string;
  @Prop() industrialDesigns: string;
  @Prop() brands: string;
  @Prop() industrialIntellectualProperty: string;
}
export const LegalRegulationsSchema =
  SchemaFactory.createForClass(LegalRegulations);

// Main Asset schema
@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class Asset {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  publishDate: Date;

  @Prop({ required: true })
  knowledgeType: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  activeKnowledgeType: string;

  @Prop()
  format: string;

  @Prop()
  fileUri: string;

  @Prop({ type: [String], default: [] })
  relatedIds: string[];

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ type: AvailabilitySchema, required: true })
  availability: Availability;

  @Prop({ type: ClassificationLevelSchema, required: true })
  classificationLevel: ClassificationLevel;

  @Prop({ type: HowIsItStoredSchema })
  howIsItStored: HowIsItStored;

  @Prop({ type: LegalRegulationsSchema })
  LegalRegulations: LegalRegulations;

  @Prop({ required: true })
  ownerId: string;

  @Prop()
  responsibleOwner: string;

  @Prop()
  confidentiality: boolean;

  @Prop()
  criticality: string;

  @Prop()
  status: string;
}

export type AssetDocument = Asset & Document;
export const AssetSchema = SchemaFactory.createForClass(Asset);
