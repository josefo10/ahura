import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** Subdocumento para elementos de catálogo: { key, descripcion } */
@Schema({ _id: false, versionKey: false })
export class EnumItem {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, default: '' })
  descripcion: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}
export const EnumItemSchema = SchemaFactory.createForClass(EnumItem);

@Schema({ versionKey: false })
export class Catalog {
  @Prop({ required: true, unique: true, index: true })
  slug: string; // "default" u otros perfiles

  @Prop({ type: [EnumItemSchema], default: [] })
  activeKnowledgeTypeEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  formatEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  knowledgeTypeEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  originEnum: EnumItem[];

  // para classificationLevel.level
  @Prop({ type: [EnumItemSchema], default: [] })
  classificationLevelLevelEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  criticalityEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  assetStatusEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  commentStatusEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  loggerActionEnum: EnumItem[];

  @Prop({ type: [EnumItemSchema], default: [] })
  repositoryEnum: EnumItem[];

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export type CatalogDocument = Catalog & Document;
export const CatalogSchema = SchemaFactory.createForClass(Catalog);
