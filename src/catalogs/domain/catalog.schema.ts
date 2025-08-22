import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Catalog {
  @Prop({ required: true, unique: true, index: true })
  slug: string; // "default" u otros perfiles

  @Prop({ type: [String], default: [] })
  activeKnowledgeTypeEnum: string[];

  @Prop({ type: [String], default: [] })
  formatEnum: string[];

  @Prop({ type: [String], default: [] })
  knowledgeTypeEnum: string[];

  @Prop({ type: [String], default: [] })
  originEnum: string[];

  @Prop({ type: [String], default: [] })
  classificationLevelLevelEnum: string[]; // para classificationLevel.level

  @Prop({ type: [String], default: [] })
  criticalityEnum: string[];

  @Prop({ type: [String], default: [] })
  assetStatusEnum: string[];

  @Prop({ type: [String], default: [] })
  commentStatusEnum: string[];

  @Prop({ type: [String], default: [] })
  loggerActionEnum: string[];

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
export type CatalogDocument = Catalog & Document;
export const CatalogSchema = SchemaFactory.createForClass(Catalog);
