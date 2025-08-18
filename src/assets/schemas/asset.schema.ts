import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Availability {
  @ApiProperty({ description: 'Indicates if the asset is accessible' })
  @Prop({ required: true })
  accessibility: boolean;

  @ApiProperty({ description: 'The location of the asset' })
  @Prop({ required: true })
  location: string;
}
export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

@Schema()
export class ClassificationLevel {
  @ApiProperty({ description: 'The classification level of the asset' })
  @Prop({ required: true })
  level: string;
}
export const ClassificationLevelSchema =
  SchemaFactory.createForClass(ClassificationLevel);

@Schema()
export class HowIsItStored {
  @ApiProperty({ description: 'The knowledge type of the asset' })
  @Prop()
  pecetKnowledge: string;

  @ApiProperty({ description: 'The centralized repositories of the asset' })
  @Prop()
  centralicedRepositories: string;
}
export const HowIsItStoredSchema = SchemaFactory.createForClass(HowIsItStored);

@Schema()
export class LegalRegulations {
  @ApiProperty({ description: 'The legal regulations of the asset' })
  @Prop()
  copyright: string;

  @ApiProperty({ description: 'The patents of the asset' })
  @Prop()
  patents: string;

  @ApiProperty({ description: 'The trade secrets of the asset' })
  @Prop()
  tradeSecrets: string;

  @ApiProperty({ description: 'The industrial designs of the asset' })
  @Prop()
  industrialDesigns: string;

  @ApiProperty({ description: 'The brands of the asset' })
  @Prop()
  brands: string;

  @ApiProperty({
    description: 'The industrial intellectual property of the asset',
  })
  @Prop()
  industrialIntellectualProperty: string;
}
export const LegalRegulationsSchema =
  SchemaFactory.createForClass(LegalRegulations);

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class Asset {
  @ApiProperty({ description: 'The id of the asset' })
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty({ description: 'The title of the asset' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'The publish date of the asset' })
  @Prop({ required: true })
  publishDate: Date;

  @ApiProperty({ description: 'The knowledge type of the asset' })
  @Prop({ required: true })
  knowledgeType: string;

  @ApiProperty({ description: 'The description of the asset' })
  @Prop()
  description: string;

  @ApiProperty({ description: 'The image of the asset' })
  @Prop()
  image: string;

  @ApiProperty({ description: 'The active knowledge type of the asset' })
  @Prop()
  activeKnowledgeType: string;

  @ApiProperty({ description: 'The format of the asset' })
  @Prop()
  format: string;

  @ApiProperty({ description: 'The file URI of the asset' })
  @Prop()
  fileUri: string;

  @ApiProperty({ description: 'The related IDs of the asset' })
  @Prop({ type: [String], default: [] })
  relatedIds: string[];

  @ApiProperty({ description: 'The keywords of the asset' })
  @Prop({ type: [String], default: [] })
  keywords: string[];

  @ApiProperty({ description: 'The availability of the asset' })
  @Prop({ type: AvailabilitySchema, required: true })
  availability: Availability;

  @ApiProperty({ description: 'The classification level of the asset' })
  @Prop({ type: ClassificationLevelSchema, required: true })
  classificationLevel: ClassificationLevel;

  @ApiProperty({ description: 'How the asset is stored' })
  @Prop({ type: HowIsItStoredSchema })
  howIsItStored: HowIsItStored;

  @ApiProperty({ description: 'The legal regulations of the asset' })
  @Prop({ type: LegalRegulationsSchema })
  legalRegulations: LegalRegulations;

  @ApiProperty({ description: 'The owner ID of the asset' })
  @Prop({ required: true })
  ownerId: string;

  @ApiProperty({ description: 'The responsible owner of the asset' })
  @Prop()
  responsibleOwner: string;

  @ApiProperty({ description: 'The confidentiality of the asset' })
  @Prop()
  confidentiality: boolean;

  @ApiProperty({ description: 'The criticality of the asset' })
  @Prop()
  criticality: string;

  @ApiProperty({ description: 'The status of the asset' })
  @Prop()
  status: string;
}

export type AssetDocument = Asset & Document;
export const AssetSchema = SchemaFactory.createForClass(Asset);
