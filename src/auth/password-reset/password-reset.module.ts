import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import {
  PasswordReset,
  PasswordResetSchema,
} from './schemas/password-reset.schema';
import { EmailService } from '../../common/email/email.service';
// Ajusta la ruta del schema de usuario según tu proyecto
import { UserSchema } from '../../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordReset.name, schema: PasswordResetSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, EmailService],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
