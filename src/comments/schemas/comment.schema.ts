import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @ApiProperty({ description: 'The id of the comment' })
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty({ description: 'The asset ID associated with the comment' })
  @Prop({ required: true })
  assetId: string;

  @ApiProperty({ description: 'The author ID of the comment' })
  @Prop({ required: true })
  authorId: string;

  @ApiProperty({ description: 'The text content of the comment' })
  @Prop({ required: true })
  text: string;

  @ApiProperty({ description: 'The status of the comment' })
  @Prop({ required: true })
  status: string;

  @ApiProperty({ description: 'The creation date of the comment' })
  @Prop({ required: true })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
