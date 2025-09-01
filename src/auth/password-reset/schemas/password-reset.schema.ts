import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordResetDocument = HydratedDocument<PasswordReset>;

@Schema({ timestamps: true, collection: 'password_resets' })
export class PasswordReset {
  @Prop({ required: true, lowercase: true, index: true })
  email!: string;

  @Prop({ required: true })
  codeHash!: string; // sha256(code + secret)

  // 👇 especifica el tipo Date
  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ default: 0 })
  attempts!: number;

  // 👇 quita la unión y define el tipo en el decorador
  @Prop({ type: Date, default: null, required: false, index: true })
  consumedAt?: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);

// TTL index para que Mongo elimine el doc al vencer expiresAt
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordResetSchema.index({ email: 1, consumedAt: 1 });
