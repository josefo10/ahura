import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class User {
  toJSON(): { [x: string]: any; password: any } {
    throw new Error('Method not implemented.');
  }
  @ApiProperty({ description: 'The id of the user' })
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'The name of the user' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The role of the user' })
  @Prop({ required: true })
  role: string;

  @ApiProperty({ description: 'The phone number of the user' })
  @Prop()
  phone: string;

  @ApiProperty({ description: 'The password of the user' })
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
