import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoggerDocument = Logger & Document;

@Schema()
export class Logger {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  assetId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  date: Date;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
