import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type LoggerDocument = Logger & Document;

@Schema()
export class Logger {
  @ApiProperty({ description: 'The id of the logger' })
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty({ description: 'The asset ID associated with the logger' })
  @Prop({ required: true })
  assetId: string;

  @ApiProperty({ description: 'The user ID associated with the logger' })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({ description: 'The action performed by the user' })
  @Prop({ required: true })
  action: string;

  @ApiProperty({ description: 'The date of the action' })
  @Prop({ required: true })
  date: Date;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
